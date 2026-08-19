export const TASK_TILE_IGNORE_SELECTOR = "[data-task-tile-ignore]";
export const TASK_TILE_SCROLL_SELECTOR = "[data-task-tile-scroll]";

export function isTaskTileIgnoreTarget(target) {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest(TASK_TILE_IGNORE_SELECTOR));
}

export function isTaskTileScrollbarClick(event) {
  if (!event?.target || typeof event.target.closest !== "function") return false;

  const scrollEl = event.target.closest(TASK_TILE_SCROLL_SELECTOR);
  if (!scrollEl || scrollEl.scrollWidth <= scrollEl.clientWidth + 1) return false;

  const rect = scrollEl.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const scrollbarHeight = scrollEl.offsetHeight - scrollEl.clientHeight;

  if (scrollbarHeight > 0) {
    return y >= scrollEl.clientHeight;
  }

  const paddingBottom =
    parseFloat(window.getComputedStyle(scrollEl).paddingBottom) || 0;

  return y >= rect.height - paddingBottom - 8;
}

export function shouldNavigateTaskTile(event) {
  return (
    !isTaskTileIgnoreTarget(event.target) && !isTaskTileScrollbarClick(event)
  );
}

export function suppressTaskTileScrollbarActivation(event) {
  if (isTaskTileScrollbarClick(event)) {
    event.stopPropagation();
  }
}
