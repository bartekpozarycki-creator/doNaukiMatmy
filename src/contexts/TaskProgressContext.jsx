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
    nextReviewAt: schedule.nextReviewAt,
  };
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
    let newFrequency;

    if (!prev) {
      newFrequency = isCorrect ? 10 : 90;
    } else {
      const currentFreq = prev.frequency;
      const delta = currentFreq * 0.5;
      if (isCorrect) {
        newFrequency = Math.max(1, Math.round(currentFreq - delta));
      } else {
        newFrequency = Math.min(100, Math.round(currentFreq + delta));
      }
    }

    const schedule = computeScheduleAfterAttempt(prev, isCorrect);

    const attempt = {
      date: new Date().toISOString(),
      isCorrect,
      frequencyAfter: newFrequency,
      intervalDaysAfter: schedule.intervalDays,
      nextReviewAtAfter: schedule.nextReviewAt,
      correctStreakAfter: schedule.correctStreak,
    };

    const entry = {
      frequency: newFrequency,
      attempts: [...(prev?.attempts || []), attempt],
      correctStreak: schedule.correctStreak,
      intervalDays: schedule.intervalDays,
      nextReviewAt: schedule.nextReviewAt,
    };

    save({ ...progress, [taskId]: entry });
  };

  const deleteLastAttempt = (taskId) => {
    const prev = progress[taskId];
    if (!prev?.attempts?.length) return;

    const attempts = prev.attempts.slice(0, -1);
    if (!attempts.length) {
      const next = { ...progress };
      delete next[taskId];
      save(next);
      return;
    }

    const lastAttempt = attempts.at(-1);
    const lastFrequency = lastAttempt?.frequencyAfter ?? prev.frequency ?? 50;

    save({
      ...progress,
      [taskId]: withResolvedSchedule({
        ...prev,
        frequency: lastFrequency,
        attempts,
        correctStreak: lastAttempt?.correctStreakAfter,
        intervalDays: lastAttempt?.intervalDaysAfter,
        nextReviewAt: lastAttempt?.nextReviewAtAfter,
      }),
    });
  };

  const getProgress = (taskId) => withResolvedSchedule(progress[taskId] || null);

  const getAllProgress = () => progress;

  const setFrequency = (taskId, frequency) => {
    const clamped = Math.min(100, Math.max(1, Math.round(Number(frequency) || 1)));
    const prev = progress[taskId];
    const schedule = scheduleFromFrequency(clamped, new Date());
    const entry = prev
      ? {
          ...prev,
          frequency: clamped,
          intervalDays: schedule.intervalDays,
          nextReviewAt: schedule.nextReviewAt,
        }
      : {
          frequency: clamped,
          attempts: [],
          intervalDays: schedule.intervalDays,
          nextReviewAt: schedule.nextReviewAt,
          correctStreak: 0,
        };
    save({ ...progress, [taskId]: entry });
  };

  return (
    <TaskProgressContext.Provider
      value={{
        progress,
        recordAttempt,
        deleteLastAttempt,
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
