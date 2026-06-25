import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ThemeContext = createContext(null);

function readStoredTheme() {
  try {
    return JSON.parse(localStorage.getItem("mm_user") || "{}").theme || "light";
  } catch {
    return "light";
  }
}

function persistTheme(theme) {
  try {
    const stored = JSON.parse(localStorage.getItem("mm_user") || "{}");
    localStorage.setItem("mm_user", JSON.stringify({ ...stored, theme }));
  } catch (error) {
    console.error("Failed to save theme", error);
  }
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    if (user?.theme) setThemeState(user.theme);
  }, [user?.theme]);

  useEffect(() => {
    const isDark = theme === "dark";
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add("dark");
      body.classList.add("dark");
      body.style.backgroundColor = "#0f172a";
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      body.style.backgroundColor = "#f9fafb";
    }
  }, [theme]);

  const setTheme = (nextTheme) => {
    setThemeState(nextTheme);
    persistTheme(nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
