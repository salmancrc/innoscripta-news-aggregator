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

export async function fetchArticles(
  params: SearchParams,
  preferredSources: NewsSourceId[]
): Promise<{ articles: Article[]; errors: Record<string, string> }> {
  const sourcesToUse: NewsSourceId[] =
    preferredSources.length > 0 ? preferredSources : ['newsapi', 'guardian', 'nyt'];

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

  deduplicatedArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return { articles: deduplicatedArticles, errors };
}
