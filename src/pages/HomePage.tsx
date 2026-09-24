import { useCallback, useEffect, useState } from "react";
import { useArticles } from "../hooks/useArticles";
import { usePreferences } from "../hooks/usePreferences";
import SearchBar from "../features/search/SearchBar";
import FilterPanel from "../features/search/FilterPanel";
import ArticleFeed from "../features/feed/ArticleFeed";
import ErrorBanner from "../components/ErrorBanner";
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

  const debouncedKeyword = useDebounce(keyword, 500);
  const { preferences } = usePreferences();

  const searchParams: SearchParams = {
    keyword: debouncedKeyword,
    category,
    source,
    fromDate,
    toDate,
  };

  const { articles, sourceErrors, isLoading } = useArticles(
    searchParams,
    preferences.sources,
  );

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-slate-900 dark:text-white">
            <svg
              role="img"
              aria-labelledby="briefly-logo-title"
              className="h-10 w-auto"
              viewBox="0 0 190 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title id="briefly-logo-title">Briefly</title>
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
              <text
                x="48"
                y="29"
                fill="currentColor"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="25"
                fontWeight="700"
                letterSpacing="-0.8"
              >
                Briefly
              </text>
            </svg>
          </h1>
          <a
            href="/preferences"
            className="rounded-md px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300"
          >
            Preferences
          </a>
        </header>

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
