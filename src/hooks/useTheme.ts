import { useCallback, useEffect, useState } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        const nextDarkMode = mediaQuery.matches;
        document.documentElement.classList.toggle("dark", nextDarkMode);
        document.documentElement.style.colorScheme = nextDarkMode ? "dark" : "light";
        setIsDarkMode(nextDarkMode);
      }
    };

    mediaQuery.addEventListener("change", onMediaChange);
    return () => mediaQuery.removeEventListener("change", onMediaChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const nextDarkMode = !root.classList.contains("dark");

    root.classList.add("theme-transition-off");
    root.classList.toggle("dark", nextDarkMode);
    root.style.colorScheme = nextDarkMode ? "dark" : "light";
    localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
    setIsDarkMode(nextDarkMode);

    window.setTimeout(() => {
      root.classList.remove("theme-transition-off");
    }, 120);
  }, []);

  return { isDarkMode, toggleTheme };
}

export default useTheme;
