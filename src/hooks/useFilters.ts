import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import {
  ALL_CATEGORIES,
  ALL_SOURCES,
  type Category,
  type NewsSourceId,
  type SearchParams,
} from "../types/source";

export interface FilterState {
  keyword: string;
  category: Category | null;
  source: NewsSourceId | null;
  fromDate: string | null;
  toDate: string | null;
}

const isValidCategory = (value: string | null): value is Category =>
  Boolean(value) && ALL_CATEGORIES.includes(value as Category);

const isValidSource = (value: string | null): value is NewsSourceId =>
  Boolean(value) && ALL_SOURCES.includes(value as NewsSourceId);

const getInitialFilterState = (params: URLSearchParams): FilterState => ({
  keyword: params.get("q") ?? "",
  category: isValidCategory(params.get("category")) ? (params.get("category") as Category) : null,
  source: isValidSource(params.get("source")) ? (params.get("source") as NewsSourceId) : null,
  fromDate: params.get("from") ?? null,
  toDate: params.get("to") ?? null,
});

const buildSearchParams = ({ keyword, category, source, fromDate, toDate }: FilterState) => {
  const next = new URLSearchParams();

  const entries: Array<[string, string]> = [
    ["q", keyword.trim()],
    ["category", category ?? ""],
    ["source", source ?? ""],
    ["from", fromDate ?? ""],
    ["to", toDate ?? ""],
  ];

  entries.forEach(([key, value]) => {
    if (value) next.set(key, value);
  });

  return next;
};

export function useFilters(preferredCategories: Category[], preferredAuthors: string[]) {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => getInitialFilterState(urlSearchParams));

  const { keyword, category, source, fromDate, toDate } = filters;
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const next = buildSearchParams({
      ...filters,
      keyword: debouncedKeyword,
    });

    const current = urlSearchParams.toString();
    const nextString = next.toString();
    if (current !== nextString) {
      setUrlSearchParams(next, { replace: true });
    }
  }, [debouncedKeyword, filters, urlSearchParams, setUrlSearchParams]);

  const effectiveCategory = useMemo(
    () => category ?? (preferredCategories.length === 1 ? preferredCategories[0] : null),
    [category, preferredCategories],
  );

  const requestParams = useMemo<SearchParams>(
    () => ({
      keyword: debouncedKeyword,
      category: effectiveCategory,
      source,
      fromDate,
      toDate,
      preferredCategories,
      preferredAuthors,
    }),
    [debouncedKeyword, effectiveCategory, source, fromDate, toDate, preferredCategories, preferredAuthors],
  );

  const updateFilter = (patch: Partial<FilterState>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  return {
    keyword,
    category,
    source,
    fromDate,
    toDate,
    effectiveCategory,
    requestParams,
    updateFilter,
  };
}

export default useFilters;
