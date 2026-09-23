import type { Article } from '../../types/article';
import type { SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';

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
  const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
  if (!apiKey) {
    throw new Error('NewsAPI key is missing');
  }

  const url = new URL('https://newsapi.org/v2/everything');
  
  const q = params.keyword ? params.keyword.trim() : '';
  url.searchParams.append('q', q || 'latest');
  
  if (params.fromDate) {
    url.searchParams.append('from', params.fromDate);
  }
  if (params.toDate) {
    url.searchParams.append('to', params.toDate);
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
    category: null,
    author: article.author ?? null,
  }));
};

export const newsApiAdapter: NewsSource = { search };
