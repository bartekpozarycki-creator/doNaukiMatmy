const gridOpacity = {
  light: 0.14,
  dark: 0.09,
};

const marginOpacity = {
  light: 0.14,
  dark: 0.1,
};

const gridThemes = {
  default: {
    light: "125, 211, 252",
    dark: "56, 189, 248",
  },
  podstawowy: {
    light: "59, 130, 246",
    dark: "96, 165, 250",
  },
  rozszerzony: {
    light: "139, 92, 246",
    dark: "167, 139, 250",
  },
  ósmoklasisty: {
    light: "16, 185, 129",
    dark: "52, 211, 153",
  },
  slate: {
    light: "100, 116, 139",
    dark: "148, 163, 184",
  },
};

function buildNotebookStyle(isDark, gridRgb) {
  const gridAlpha = isDark ? gridOpacity.dark : gridOpacity.light;
  const marginAlpha = isDark ? marginOpacity.dark : marginOpacity.light;
  const gridColor = `rgba(${gridRgb}, ${gridAlpha})`;

  return {
    backgroundColor: isDark ? "#1a2332" : "#ffffff",
    backgroundImage: `
      linear-gradient(to bottom, ${gridColor} 1px, transparent 1px),
      linear-gradient(to right, ${gridColor} 1px, transparent 1px),
      linear-gradient(to right, transparent 52px, rgba(251, 113, 133, ${marginAlpha}) 52px, rgba(251, 113, 133, ${marginAlpha}) 53px, transparent 53px)
    `,
    backgroundSize: "26px 26px, 26px 26px, 100% 100%",
  };
}

export const notebookPageStyle = {
  light: buildNotebookStyle(false, gridThemes.default.light),
  dark: buildNotebookStyle(true, gridThemes.default.dark),
};

export function getNotebookPageStyle(isDark, themeKey = "default") {
  const theme = gridThemes[themeKey] || gridThemes.default;
  const gridRgb = isDark ? theme.dark : theme.light;
  return buildNotebookStyle(isDark, gridRgb);
}

export const NOTEBOOK_EXCLUDED_PAGES = ["Home"];

export function shouldShowNotebookBackground(pageName) {
  return !NOTEBOOK_EXCLUDED_PAGES.includes(pageName);
}

export function getLayoutNotebookThemeKey() {
  return "default";
}
