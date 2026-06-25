import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CLOUD_SYNC_KEYS,
  isCloudSyncReady,
  loadCloudData,
  markCloudSyncReady,
  mergeWorksheetProgress,
  readLocalJson,
  saveCloudData,
  writeLocalJson,
} from "@/utils/cloud-sync";

const STORAGE_KEY = "mm_worksheet_progress";

function storageKey(userId) {
  return userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
}

export const WORKSHEET_STATUS = {
  STARTED: "started",
  COMPLETED: "completed",
};

function getStored(userId) {
  const scoped = readLocalJson(storageKey(userId), null);
  if (Array.isArray(scoped)) return scoped;
  return readLocalJson(STORAGE_KEY, []);
}

function writeStored(userId, items) {
  writeLocalJson(storageKey(userId), items);
}

export function isWorksheetCompleted(attempt) {
  if (!attempt) return false;
  if (attempt.status === WORKSHEET_STATUS.COMPLETED) return true;
  return (
    attempt.status !== WORKSHEET_STATUS.STARTED &&
    attempt.score != null &&
    attempt.total != null
  );
}

export function isWorksheetStarted(attempt) {
  if (attempt?.status !== WORKSHEET_STATUS.STARTED) return false;
  if ((attempt.answeredCount ?? 0) > 0) return true;
  if (!attempt.answers || typeof attempt.answers !== "object") return false;
  return Object.values(attempt.answers).some(
    (value) => value != null && String(value).trim() !== "",
  );
}

export function snapshotCompletedAttempt(attempt) {
  if (!isWorksheetCompleted(attempt)) return null;
  return {
    id: attempt.id,
    title: attempt.title,
    status: WORKSHEET_STATUS.COMPLETED,
    score: attempt.score,
    total: attempt.total,
    timeSpent: attempt.timeSpent,
    date: attempt.date,
    updatedAt: attempt.updatedAt,
  };
}

export function useWorksheetProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(() => getStored(user?.id));

  useEffect(() => {
    let cancelled = false;
    const localProgress = getStored(user?.id);
    writeStored(user?.id, localProgress);
    setProgress(localProgress);

    if (!user?.id) return () => {
      cancelled = true;
    };

    loadCloudData(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS)
      .then((cloudProgress) => {
        if (cancelled) return;
        const merged =
          isCloudSyncReady(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS) &&
          Array.isArray(cloudProgress)
            ? cloudProgress
            : mergeWorksheetProgress(localProgress, cloudProgress);
        writeStored(user.id, merged);
        setProgress(merged);
        return saveCloudData(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS, merged).then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS);
        });
      })
      .catch((error) => {
        console.error("[cloud-sync] worksheet progress", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const saveProgress = useCallback((attempt, options = {}) => {
    const { silent = false } = options;
    const updated = [...getStored(user?.id).filter((a) => a.id !== attempt.id), attempt];
    writeStored(user?.id, updated);
    if (!silent) {
      setProgress(updated);
    }
    if (user?.id) {
      saveCloudData(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS, updated)
        .then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS);
        })
        .catch((error) => {
          console.error("[cloud-sync] worksheet progress save", error);
        });
    }
  }, [user?.id]);

  const clearProgress = useCallback((id) => {
    const updated = getStored(user?.id).filter((a) => a.id !== id);
    writeStored(user?.id, updated);
    setProgress(updated);
    if (user?.id) {
      saveCloudData(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS, updated)
        .then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS);
        })
        .catch((error) => {
          console.error("[cloud-sync] worksheet progress clear", error);
        });
    }
  }, [user?.id]);

  const getAttempt = useCallback((id) => {
    return progress.find((a) => a.id === id);
  }, [progress]);

  const getAll = useCallback(() => progress, [progress]);

  const restorePreviousCompleted = useCallback(
    (id, options = {}) => {
      const { silent = false } = options;
      const existing = getStored(user?.id).find((a) => a.id === id);
      if (!existing) return false;
      const snapshot = existing.previousCompleted
        ? { ...existing.previousCompleted, id, status: WORKSHEET_STATUS.COMPLETED }
        : isWorksheetCompleted(existing)
          ? snapshotCompletedAttempt(existing)
          : null;
      if (!snapshot) {
        const updated = getStored(user?.id).filter((a) => a.id !== id);
        writeStored(user?.id, updated);
        if (!silent) {
          setProgress(updated);
        }
        if (user?.id) {
          saveCloudData(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS, updated)
            .then(() => {
              markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS);
            })
            .catch((error) => {
              console.error("[cloud-sync] worksheet progress restore", error);
            });
        }
        return false;
      }
      saveProgress(snapshot, { silent });
      return true;
    },
    [saveProgress, user?.id],
  );

  return {
    saveProgress,
    clearProgress,
    getAttempt,
    getAll,
    restorePreviousCompleted,
  };
}
