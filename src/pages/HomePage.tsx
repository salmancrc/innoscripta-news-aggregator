import { useCallback, useEffect, useState } from "react";
import { useArticles } from "../hooks/useArticles";
import { usePreferences } from "../hooks/usePreferences";
import SearchBar from "../features/search/SearchBar";
import FilterPanel from "../features/search/FilterPanel";
import ArticleFeed from "../features/feed/ArticleFeed";
import ErrorBanner from "../components/ErrorBanner";
import PreferencesDrawer from "../features/preferences/PreferencesDrawer";
import type { SearchParams } from "../types/source";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

const HomePage = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<SearchParams["category"]>(null);
  const [source, setSource] = useState<SearchParams["source"]>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  const debouncedKeyword = useDebounce(keyword, 500);
  const { preferences, updatePreferences, resetPreferences } = usePreferences();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onMediaChange = () => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const nextDarkMode = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', nextDarkMode);
        document.documentElement.style.colorScheme = nextDarkMode ? 'dark' : 'light';
        setIsDarkMode(nextDarkMode);
      }
    };

    mediaQuery.addEventListener('change', onMediaChange);
    return () => mediaQuery.removeEventListener('change', onMediaChange);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDarkMode = !root.classList.contains('dark');

    root.classList.add('theme-transition-off');
    root.classList.toggle('dark', nextDarkMode);
    root.style.colorScheme = nextDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', nextDarkMode ? 'dark' : 'light');
    setIsDarkMode(nextDarkMode);

    window.setTimeout(() => {
      root.classList.remove('theme-transition-off');
    }, 120);
  };

  const searchParams: SearchParams = {
    keyword: debouncedKeyword,
    category,
    source,
    fromDate,
    toDate,
    preferredCategories: preferences.categories,
    preferredAuthors: preferences.authors,
  };

  const { articles, sourceErrors, isLoading } = useArticles(
    searchParams,
    preferences.sources,
  );

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-1 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out dark:border-slate-700 dark:bg-slate-900/80 sm:px-6">
          <div className="flex items-center gap-3 self-center leading-none">
            <svg
              role="img"
              aria-label="Briefly"
              className="h-9 w-9 shrink-0 self-center"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="briefly-logo-gradient" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <path
                d="M20 4C11.163 4 4 10.492 4 18.5c0 4.24 2.06 8.076 5.382 10.726L8 36l7.45-3.725A18.96 18.96 0 0 0 20 33c8.837 0 16-6.492 16-14.5S28.837 4 20 4Z"
                fill="url(#briefly-logo-gradient)"
              />
              <path
                d="M12 15h16M12 20h16M12 25h10"
                stroke="white"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
            </svg>
            <span className="flex items-center self-center text-[1.85rem] font-semibold leading-none tracking-[-0.06em] text-slate-900 dark:text-slate-100">
              Briefly
            </span>
          </div>

          <div className="flex items-center gap-2 self-center">
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(true)}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900"
            >
              Preferences
            </button>

            <button
              type="button"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              className="group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
            >
              <span
                className={`relative flex items-center justify-center transition-all duration-300 ease-out ${isDarkMode ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
              >
                {isDarkMode ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.9 5.1l-1.77 1.77M6.87 17.13l-1.77 1.77M18.9 18.9l-1.77-1.77M6.87 6.87 5.1 5.1" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </header>

        <PreferencesDrawer
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          preferences={preferences}
          onUpdate={updatePreferences}
          onReset={resetPreferences}
        />

        <SearchBar value={keyword} onChange={handleKeywordChange} />

        <FilterPanel
          selectedCategory={category}
          selectedSource={source}
          fromDate={fromDate}
          toDate={toDate}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />

        <ErrorBanner errors={sourceErrors} />

        <ArticleFeed articles={articles} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default HomePage;
