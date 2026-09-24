import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../services/aggregator';
import type { SearchParams, NewsSourceId } from '../types/source';
import type { Article } from '../types/article';

export function useArticles(
  params: SearchParams,
  preferredSources: NewsSourceId[]
): {
  articles: Article[];
  sourceErrors: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['articles', params, preferredSources],
    queryFn: () => fetchArticles(params, preferredSources),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    articles: data?.articles ?? [],
    sourceErrors: data?.errors ?? {},
    isLoading,
    isError,
    error,
  };
}

export default useArticles;
