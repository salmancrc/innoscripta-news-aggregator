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
          <h1 className="text-3xl font-bold tracking-tight">NewsHub</h1>
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
