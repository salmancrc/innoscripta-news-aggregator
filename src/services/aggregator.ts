import { newsApiAdapter } from './adapters/newsApiAdapter';
import { guardianAdapter } from './adapters/guardianAdapter';
import { nytAdapter } from './adapters/nytAdapter';

import type { Article } from '../types/article';
import type { SearchParams, NewsSourceId } from '../types/source';
import type { NewsSource } from './newsSource';

const activeAdapters: Record<NewsSourceId, NewsSource> = {
  newsapi: newsApiAdapter,
  guardian: guardianAdapter,
  nyt: nytAdapter,
};

const normalizeCategory = (category: string | null | undefined): string | null => {
  if (!category) return null;
  return category.trim().toLowerCase();
};

export async function fetchArticles(
  params: SearchParams,
  preferredSources: NewsSourceId[],
): Promise<{ articles: Article[]; errors: Record<string, string> }> {
  const sourcesToUse: NewsSourceId[] = params.source
    ? [params.source]
    : preferredSources.length > 0
      ? preferredSources
      : ['newsapi', 'guardian', 'nyt'];

  const promises = sourcesToUse.map((sourceId) => activeAdapters[sourceId].search(params));
  
  const results = await Promise.allSettled(promises);

  const allArticles: Article[] = [];
  const errors: Record<string, string> = {};

  results.forEach((result, index) => {
    const sourceId = sourcesToUse[index];
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      errors[sourceId] = result.reason instanceof Error ? result.reason.message : String(result.reason);
    }
  });

  const uniqueArticlesMap = new Map<string, Article>();
  for (const article of allArticles) {
    if (!uniqueArticlesMap.has(article.url)) {
      uniqueArticlesMap.set(article.url, article);
    }
  }

const deduplicatedArticles = Array.from(uniqueArticlesMap.values());

  let filteredArticles = deduplicatedArticles.filter((article) => {
    const publishedDate = article.publishedAt.slice(0, 10);
    const fromDate = params.fromDate?.slice(0, 10);
    const toDate = params.toDate?.slice(0, 10);
    const normalizedArticleCategory = normalizeCategory(article.category);
    const normalizedSelectedCategory = normalizeCategory(params.category);

    if (normalizedSelectedCategory && normalizedArticleCategory !== normalizedSelectedCategory) return false;
    if (fromDate && publishedDate < fromDate) return false;
    if (toDate && publishedDate > toDate) return false;
    return true;
  });

  if (!params.category && params.preferredCategories.length > 0) {
    filteredArticles = filteredArticles.filter((article) => {
      const normalizedArticleCategory = normalizeCategory(article.category);
      return normalizedArticleCategory !== null && params.preferredCategories.some(
        (preferredCategory) => normalizeCategory(preferredCategory) === normalizedArticleCategory,
      );
    });
  }

  // Apply preferred authors filter client-side if user has preferred authors
  if (params.preferredAuthors.length > 0) {
    filteredArticles = filteredArticles.filter((article) =>
      article.author && params.preferredAuthors.some((preferredAuthor) =>
        article.author!.toLowerCase().includes(preferredAuthor.toLowerCase())
      )
    );
  }

  filteredArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return { articles: filteredArticles, errors };
}
