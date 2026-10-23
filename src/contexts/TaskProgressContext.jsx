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
    reviewStatus: schedule.reviewStatus,
    masteryStatus: schedule.masteryStatus,
    reviewReason: schedule.reviewReason,
  };
}

function buildEntryFromAttempts(attempts, baseDifficulty = null) {
  return attempts.reduce((entry, attempt) => {
    const isCorrect = Boolean(attempt?.isCorrect);
    const attemptDate = attempt?.date ? new Date(attempt.date) : new Date();
    const schedule = computeScheduleAfterAttempt(
      entry,
      isCorrect,
      baseDifficulty ?? entry?.baseDifficulty ?? null,
      attemptDate,
    );
    const rebuiltAttempt = {
      ...attempt,
      date: attempt?.date || attemptDate.toISOString(),
      isCorrect,
      intervalDaysAfter: schedule.intervalDays,
      intervalHoursAfter: schedule.intervalHours,
      nextReviewAtAfter: schedule.nextReviewAt,
      correctStreakAfter: schedule.correctStreak,
      difficultyScoreAfter: schedule.difficultyScore,
      reviewStatusAfter: schedule.reviewStatus,
    };
    const entryBase = {
      baseDifficulty: baseDifficulty ?? entry?.baseDifficulty ?? null,
      attempts: [...(entry?.attempts || []), rebuiltAttempt],
      correctStreak: schedule.correctStreak,
      intervalDays: schedule.intervalDays,
      intervalHours: schedule.intervalHours,
      nextReviewAt: schedule.nextReviewAt,
      difficultyScore: schedule.difficultyScore,
      reviewStatus: schedule.reviewStatus,
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

  const persistProgress = (next) => {
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

  const save = (next) => {
    setProgress(next);
    persistProgress(next);
  };

  const applyAttemptToProgress = (current, taskId, isCorrect, options = {}) => {
    if (taskId == null || taskId === "") return current;
    const key = String(taskId);
    const prev = current[key] ?? current[taskId];
    const baseDifficulty =
      options.baseDifficulty ?? prev?.baseDifficulty ?? null;

    const schedule = computeScheduleAfterAttempt(
      prev,
      isCorrect,
      baseDifficulty,
    );

    const attempt = {
      date: new Date().toISOString(),
      isCorrect,
      intervalDaysAfter: schedule.intervalDays,
      intervalHoursAfter: schedule.intervalHours,
      nextReviewAtAfter: schedule.nextReviewAt,
      correctStreakAfter: schedule.correctStreak,
      difficultyScoreAfter: schedule.difficultyScore,
      reviewStatusAfter: schedule.reviewStatus,
    };

    const entryBase = {
      baseDifficulty,
      attempts: [...(prev?.attempts || []), attempt],
      correctStreak: schedule.correctStreak,
      intervalDays: schedule.intervalDays,
      intervalHours: schedule.intervalHours,
      nextReviewAt: schedule.nextReviewAt,
      difficultyScore: schedule.difficultyScore,
      reviewStatus: schedule.reviewStatus,
    };
    const metrics = computeReviewMetrics(entryBase);
    const entry = { ...entryBase, ...metrics };

    const next = { ...current, [key]: entry };
    if (key !== taskId && Object.prototype.hasOwnProperty.call(next, taskId)) {
      delete next[taskId];
    }
    return next;
  };

  const recordAttempt = (taskId, isCorrect, options = {}) => {
    setProgress((current) => {
      const next = applyAttemptToProgress(current, taskId, isCorrect, options);
      persistProgress(next);
      return next;
    });
  };

  const recordAttempts = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setProgress((current) => {
      let next = current;
      items.forEach((item) => {
        if (!item) return;
        next = applyAttemptToProgress(
          next,
          item.taskId,
          item.isCorrect,
          item.options || {},
        );
      });
      persistProgress(next);
      return next;
    });
  };

  const deleteAttempt = (taskId, attemptIndex) => {
    setProgress((current) => {
      const key = String(taskId);
      const prev = current[key] ?? current[taskId];
      if (!prev?.attempts?.length) return current;

      const attempts = prev.attempts.filter((_, index) => index !== attemptIndex);
      let next;
      if (!attempts.length) {
        next = { ...current };
        delete next[key];
        if (key !== taskId) delete next[taskId];
      } else {
        next = {
          ...current,
          [key]: buildEntryFromAttempts(attempts, prev.baseDifficulty),
        };
        if (key !== taskId && Object.prototype.hasOwnProperty.call(next, taskId)) {
          delete next[taskId];
        }
      }
      persistProgress(next);
      return next;
    });
  };

  const getProgress = (taskId) => {
    if (taskId == null || taskId === "") return null;
    const key = String(taskId);
    return withResolvedSchedule(progress[key] || progress[taskId] || null);
  };

  const getAllProgress = () => progress;

  return (
    <TaskProgressContext.Provider
      value={{
        progress,
        recordAttempt,
        recordAttempts,
        deleteAttempt,
        getProgress,
        getAllProgress,
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
