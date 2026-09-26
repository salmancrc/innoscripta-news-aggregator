import type { Article } from '../../types/article';
import type { SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';
import { cleanAuthor } from '../../lib/utils';
import { appendParam, getRequiredApiKey } from '../api';

interface NewsApiArticle {
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  author: string | null;
  source: {
    id: string | null;
    name: string;
  };
}

interface NewsApiResponse {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  message?: string;
  code?: string;
}

const search = async (params: SearchParams): Promise<Article[]> => {
  const apiKey = getRequiredApiKey('VITE_NEWSAPI_KEY', 'NewsAPI key is missing');

  if (params.category && (params.fromDate || params.toDate)) {
    throw new Error(
      "Category and date filters can't be used together. Try removing one of these filters to broaden your search.",
    );
  }

  const url = new URL(
    params.category
      ? 'https://newsapi.org/v2/top-headlines'
      : 'https://newsapi.org/v2/everything',
  );
  
  const keyword = params.keyword.trim();
  if (keyword) {
    url.searchParams.append('q', keyword);
  } else if (!params.category) {
    url.searchParams.append('q', 'latest');
  }
  
  if (params.category) {
    url.searchParams.append('category', params.category);
  } else {
  if (params.fromDate) {
    appendParam(url, 'from', params.fromDate);
  }
  if (params.toDate) {
    appendParam(url, 'to', params.toDate);
  }
  }

  url.searchParams.append('apiKey', apiKey);

  const response = await fetch(url.toString());
  const data: NewsApiResponse = await response.json();

  if (data.status !== 'ok') {
    throw new Error(data.message || 'NewsAPI request failed');
  }

  if (!data.articles) {
    return [];
  }

  return data.articles.map((article) => ({
    id: btoa(article.url),
    title: article.title ?? '',
    description: article.description ?? null,
    url: article.url,
    imageUrl: article.urlToImage ?? null,
    publishedAt: article.publishedAt,
    source: 'NewsAPI',
    category: params.category,
    author: cleanAuthor(article.author ?? null, article.url),
  }));
};

export const newsApiAdapter: NewsSource = { search };
