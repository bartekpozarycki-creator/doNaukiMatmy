import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CLOUD_SYNC_KEYS,
  isCloudSyncReady,
  loadCloudData,
  markCloudSyncReady,
  mergeTaskProgress,
  readLocalJson,
  saveCloudData,
  writeLocalJson,
} from "@/utils/cloud-sync";
import {
  computeScheduleAfterAttempt,
  computeReviewMetrics,
  resolveTaskSchedule,
  scheduleFromFrequency,
} from "@/utils/review-schedule";

const TaskProgressContext = createContext();
const childrenPropType = () => null;

function withResolvedSchedule(entry) {
  if (!entry) return entry;
  const schedule = resolveTaskSchedule(entry);
  if (!schedule) return entry;
  return {
    ...entry,
    correctStreak: schedule.correctStreak,
    intervalDays: schedule.intervalDays,
    intervalHours: schedule.intervalHours,
    nextReviewAt: schedule.nextReviewAt,
    difficultyScore: schedule.difficultyScore,
    masteryStatus: schedule.masteryStatus,
    reviewReason: schedule.reviewReason,
  };
}

function getNextFrequency(prevEntry, isCorrect) {
  if (!prevEntry) return isCorrect ? 10 : 90;

  const currentFreq = prevEntry.frequency;
  const delta = currentFreq * 0.5;
  if (isCorrect) {
    return Math.max(1, Math.round(currentFreq - delta));
  }
  return Math.min(100, Math.round(currentFreq + delta));
}

function buildEntryFromAttempts(attempts) {
  return attempts.reduce((entry, attempt) => {
    const isCorrect = Boolean(attempt?.isCorrect);
    const attemptDate = attempt?.date ? new Date(attempt.date) : new Date();
    const newFrequency = getNextFrequency(entry, isCorrect);
    const schedule = computeScheduleAfterAttempt(
      entry,
      isCorrect,
      newFrequency,
      attemptDate,
    );
    const rebuiltAttempt = {
      ...attempt,
      date: attempt?.date || attemptDate.toISOString(),
      isCorrect,
      frequencyAfter: newFrequency,
      intervalDaysAfter: schedule.intervalDays,
      intervalHoursAfter: schedule.intervalHours,
      nextReviewAtAfter: schedule.nextReviewAt,
      correctStreakAfter: schedule.correctStreak,
      difficultyScoreAfter: schedule.difficultyScore,
    };
    const entryBase = {
      frequency: newFrequency,
      attempts: [...(entry?.attempts || []), rebuiltAttempt],
      correctStreak: schedule.correctStreak,
      intervalDays: schedule.intervalDays,
      intervalHours: schedule.intervalHours,
      nextReviewAt: schedule.nextReviewAt,
      difficultyScore: schedule.difficultyScore,
    };
    return { ...entryBase, ...computeReviewMetrics(entryBase) };
  }, null);
}

export function TaskProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    let cancelled = false;
    const key = user?.id ? `mm_task_progress_${user.id}` : "mm_task_progress_guest";
    const localProgress = readLocalJson(key, {});
    setProgress(localProgress);

    if (!user?.id) return () => {
      cancelled = true;
    };

    loadCloudData(user.id, CLOUD_SYNC_KEYS.TASK_PROGRESS)
      .then((cloudProgress) => {
        if (cancelled) return;
        const merged =
          isCloudSyncReady(user.id, CLOUD_SYNC_KEYS.TASK_PROGRESS) && cloudProgress
            ? cloudProgress
            : mergeTaskProgress(localProgress, cloudProgress);
        setProgress(merged);
        writeLocalJson(key, merged);
        return saveCloudData(user.id, CLOUD_SYNC_KEYS.TASK_PROGRESS, merged).then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.TASK_PROGRESS);
        });
      })
      .catch((error) => {
        console.error("[cloud-sync] task progress", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const save = (next) => {
    setProgress(next);
    const key = user?.id ? `mm_task_progress_${user.id}` : "mm_task_progress_guest";
    writeLocalJson(key, next);
    if (user?.id) {
      saveCloudData(user.id, CLOUD_SYNC_KEYS.TASK_PROGRESS, next)
        .then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.TASK_PROGRESS);
        })
        .catch((error) => {
          console.error("[cloud-sync] task progress save", error);
        });
    }
  };

  const recordAttempt = (taskId, isCorrect) => {
    const prev = progress[taskId];
    const newFrequency = getNextFrequency(prev, isCorrect);

    const schedule = computeScheduleAfterAttempt(prev, isCorrect, newFrequency);

    const attempt = {
      date: new Date().toISOString(),
      isCorrect,
      frequencyAfter: newFrequency,
      intervalDaysAfter: schedule.intervalDays,
      intervalHoursAfter: schedule.intervalHours,
      nextReviewAtAfter: schedule.nextReviewAt,
      correctStreakAfter: schedule.correctStreak,
      difficultyScoreAfter: schedule.difficultyScore,
    };

    const entryBase = {
      frequency: newFrequency,
      attempts: [...(prev?.attempts || []), attempt],
      correctStreak: schedule.correctStreak,
      intervalDays: schedule.intervalDays,
      intervalHours: schedule.intervalHours,
      nextReviewAt: schedule.nextReviewAt,
      difficultyScore: schedule.difficultyScore,
    };
    const metrics = computeReviewMetrics(entryBase);
    const entry = { ...entryBase, ...metrics };

    save({ ...progress, [taskId]: entry });
  };

  const deleteAttempt = (taskId, attemptIndex) => {
    const prev = progress[taskId];
    if (!prev?.attempts?.length) return;

    const attempts = prev.attempts.filter((_, index) => index !== attemptIndex);
    if (!attempts.length) {
      const next = { ...progress };
      delete next[taskId];
      save(next);
      return;
    }

    save({
      ...progress,
      [taskId]: buildEntryFromAttempts(attempts),
    });
  };

  const getProgress = (taskId) => withResolvedSchedule(progress[taskId] || null);

  const getAllProgress = () => progress;

  const setFrequency = (taskId, frequency) => {
    const clamped = Math.min(100, Math.max(1, Math.round(Number(frequency) || 1)));
    const prev = progress[taskId];
    const schedule = scheduleFromFrequency(clamped, new Date());
    const entryBase = prev
      ? {
          ...prev,
          frequency: clamped,
          intervalDays: schedule.intervalDays,
          intervalHours: null,
          nextReviewAt: schedule.nextReviewAt,
        }
      : {
          frequency: clamped,
          attempts: [],
          intervalDays: schedule.intervalDays,
          intervalHours: null,
          nextReviewAt: schedule.nextReviewAt,
          correctStreak: 0,
        };
    const entry = withResolvedSchedule({
      ...entryBase,
      ...computeReviewMetrics(entryBase),
    });
    save({ ...progress, [taskId]: entry });
  };

  return (
    <TaskProgressContext.Provider
      value={{
        progress,
        recordAttempt,
        deleteAttempt,
        getProgress,
        getAllProgress,
        setFrequency,
      }}
    >
      {children}
    </TaskProgressContext.Provider>
  );
}

TaskProgressProvider.propTypes = {
  children: childrenPropType,
};

export const useTaskProgress = () => useContext(TaskProgressContext);
