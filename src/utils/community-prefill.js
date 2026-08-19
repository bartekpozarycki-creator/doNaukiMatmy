import { createPageUrl } from "@/utils";

export const COMMUNITY_PREFILL_TASK_KEY = "mathmaster_community_prefill_task";

export function storeCommunityPrefillTask(task) {
  if (!task) return;
  sessionStorage.setItem(COMMUNITY_PREFILL_TASK_KEY, JSON.stringify(task));
}

export function clearCommunityPrefillTask() {
  sessionStorage.removeItem(COMMUNITY_PREFILL_TASK_KEY);
}

export function consumeCommunityPrefillTask() {
  const raw = sessionStorage.getItem(COMMUNITY_PREFILL_TASK_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(COMMUNITY_PREFILL_TASK_KEY);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function openCommunityWithPrefill(task) {
  storeCommunityPrefillTask(task);
  window.open(
    `${window.location.origin}${createPageUrl("Community")}`,
    "_blank",
    "noopener,noreferrer",
  );
}
