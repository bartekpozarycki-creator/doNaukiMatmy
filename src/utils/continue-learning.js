import {
  CLOUD_SYNC_KEYS,
  loadCloudData,
  readLocalJson,
  saveCloudData,
  writeLocalJson,
} from "@/utils/cloud-sync";

const STORAGE_PREFIX = "mm_continue_learning";
const MAX_ITEMS = 20;

function storageKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : `${STORAGE_PREFIX}_guest`;
}

function itemKey(item) {
  return `${item.type}:${item.id}`;
}

function normalizeItems(items) {
  return Array.isArray(items)
    ? items.filter((item) => item?.type && item?.id && item?.href)
    : [];
}

export function readContinueLearning(userId) {
  return normalizeItems(readLocalJson(storageKey(userId), []));
}

export function mergeContinueLearning(localItems, cloudItems) {
  const merged = new Map();

  for (const item of [...normalizeItems(cloudItems), ...normalizeItems(localItems)]) {
    const key = itemKey(item);
    const current = merged.get(key);
    const itemTime = Date.parse(item.updatedAt || "") || 0;
    const currentTime = Date.parse(current?.updatedAt || "") || 0;
    if (!current || itemTime >= currentTime) {
      merged.set(key, item);
    }
  }

  return [...merged.values()]
    .sort((a, b) => (Date.parse(b.updatedAt || "") || 0) - (Date.parse(a.updatedAt || "") || 0))
    .slice(0, MAX_ITEMS);
}

export async function loadContinueLearning(userId) {
  const localItems = readContinueLearning(userId);
  if (!userId) return localItems;

  const cloudItems = await loadCloudData(userId, CLOUD_SYNC_KEYS.CONTINUE_LEARNING);
  const merged = mergeContinueLearning(localItems, cloudItems);
  writeLocalJson(storageKey(userId), merged);
  await saveCloudData(userId, CLOUD_SYNC_KEYS.CONTINUE_LEARNING, merged);
  return merged;
}

export function recordContinueLearning(userId, item) {
  if (!item?.type || !item?.id || !item?.href) return [];

  const nextItem = {
    ...item,
    id: String(item.id),
    updatedAt: new Date().toISOString(),
  };
  const current = readContinueLearning(userId);
  const updated = [
    nextItem,
    ...current.filter((entry) => itemKey(entry) !== itemKey(nextItem)),
  ].slice(0, MAX_ITEMS);

  writeLocalJson(storageKey(userId), updated);

  if (userId) {
    saveCloudData(userId, CLOUD_SYNC_KEYS.CONTINUE_LEARNING, updated).catch((error) => {
      console.error("[cloud-sync] continue learning save", error);
    });
  }

  return updated;
}

export function pickLatestByType(items) {
  const latest = new Map();

  for (const item of normalizeItems(items)) {
    const current = latest.get(item.type);
    const itemTime = Date.parse(item.updatedAt || "") || 0;
    const currentTime = Date.parse(current?.updatedAt || "") || 0;
    if (!current || itemTime > currentTime) {
      latest.set(item.type, item);
    }
  }

  return ["task", "worksheet", "course"]
    .map((type) => latest.get(type))
    .filter(Boolean);
}
