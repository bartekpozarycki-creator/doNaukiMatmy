import { createPageUrl } from "@/utils";

const BACK_PRESETS = {
  favorites: {
    to: createPageUrl("Favorites"),
    label: "Powrót do ulubionych",
  },
  "task-sets": {
    to: createPageUrl("TaskSets"),
    label: "Powrót do zbiorów",
  },
  review: {
    to: createPageUrl("Review"),
    label: "Powrót do powtórek",
  },
  "review-random": {
    to: createPageUrl("Review"),
    label: "Powrót do powtórek",
  },
  unfinished: {
    to: createPageUrl("Unfinished"),
    label: "Powrót do niedokończonych",
  },
  community: {
    to: createPageUrl("Community"),
    label: "Powrót do społeczności",
  },
  home: {
    to: createPageUrl("Home"),
    label: "Powrót do strony głównej",
  },
  article: {
    label: "Powrót do artykułu",
  },
  "exam-topic-tasks": {
    label: "Powrót do listy zadań",
  },
  "question-details": {
    label: "Powrót do pytania",
  },
};

export function buildTaskDetailsNavState({
  from,
  backTo,
  backLabel,
  ...rest
} = {}) {
  return {
    ...(from ? { from } : {}),
    ...(backTo ? { backTo } : {}),
    ...(backLabel ? { backLabel } : {}),
    ...rest,
  };
}

export function resolveTaskDetailsBackLink(location) {
  const state = location?.state || {};
  const preset = state.from ? BACK_PRESETS[state.from] : null;

  if (state.backTo) {
    return {
      to: state.backTo,
      label: state.backLabel || preset?.label || "Powrót",
    };
  }

  if (preset?.to) {
    return {
      to: preset.to,
      label: state.backLabel || preset.label,
    };
  }

  return {
    to: createPageUrl("TaskSets"),
    label: "Powrót do zbiorów",
  };
}
