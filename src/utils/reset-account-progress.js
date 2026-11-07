import { supabase } from "@/supabase-config.js";
import {
  CLOUD_SYNC_KEYS,
  markCloudSyncReady,
  saveCloudData,
  writeLocalJson,
} from "@/utils/cloud-sync";

const PROGRESS_CLOUD_KEYS = [
  CLOUD_SYNC_KEYS.TASK_PROGRESS,
  CLOUD_SYNC_KEYS.WORKSHEET_PROGRESS,
  CLOUD_SYNC_KEYS.CONTINUE_LEARNING,
  CLOUD_SYNC_KEYS.CKE_STRUCK,
];

function localProgressKeys(userId) {
  return [
    `mm_task_progress_${userId}`,
    `mm_worksheet_progress_${userId}`,
    `mm_continue_learning_${userId}`,
    `mm_cke_struck_${userId}`,
  ];
}

function clearQuestionViewKeys(userId) {
  const prefix = `mm_question_viewed:${userId}:`;
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) toRemove.push(key);
  }
  toRemove.forEach((key) => localStorage.removeItem(key));
}

function emptyPayloadForKey(key) {
  if (key === CLOUD_SYNC_KEYS.TASK_PROGRESS) return {};
  return [];
}

export async function verifyAccountPassword(email, password) {
  if (!email || !password) {
    throw new Error("Podaj hasło");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(
      error.message === "Invalid login credentials"
        ? "Nieprawidłowe hasło"
        : error.message,
    );
  }
}

export async function resetAccountProgress(userId) {
  if (!userId) {
    throw new Error("Brak zalogowanego użytkownika");
  }

  for (const key of localProgressKeys(userId)) {
    writeLocalJson(
      key,
      key.includes("task_progress") ? {} : [],
    );
  }
  clearQuestionViewKeys(userId);

  await Promise.all(
    PROGRESS_CLOUD_KEYS.map(async (key) => {
      const empty = emptyPayloadForKey(key);
      await saveCloudData(userId, key, empty);
      markCloudSyncReady(userId, key);
    }),
  );
}
