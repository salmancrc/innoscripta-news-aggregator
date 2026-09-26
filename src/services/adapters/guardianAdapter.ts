import type { Article } from '../../types/article';
import type { Category, SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';
import { cleanAuthor } from '../../lib/utils';
import { appendParam, getRequiredApiKey, toISODate } from '../api';

interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    byline?: string;
  };
}

interface GuardianResponse {
  response: {
    status: string;
    results?: GuardianArticle[];
    message?: string;
    pages?: number;
    currentPage?: number;
  };
}

const CATEGORY_MATCHERS: Array<{ category: Category; keywords: string[] }> = [
  { category: 'technology', keywords: ['tech'] },
  { category: 'science', keywords: ['science'] },
  {
    category: 'health',
    keywords: ['health', 'medical', 'life and style', 'lifeandstyle', 'lifestyle'],
  },
  { category: 'business', keywords: ['business', 'money', 'economy'] },
  { category: 'sports', keywords: ['sport'] },
  {
    category: 'entertainment',
    keywords: ['entertainment', 'film', 'music', 'culture', 'arts'],
  },
  {
    category: 'general',
    keywords: ['news', 'world', 'uk', 'global', 'politic'],
  },
];

const mapCategory = (sectionName: string): Category | null => {
  const lower = sectionName.trim().toLowerCase();

  const matchedCategory = CATEGORY_MATCHERS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword)),
  );

  return matchedCategory?.category ?? null;
};

const guardianSectionByCategory: Partial<Record<Category, string>> = {
  technology: 'technology',
  science: 'science',
  health: 'lifeandstyle',
  business: 'business',
  sports: 'sport',
  entertainment: 'culture',
};

const search = async (params: SearchParams): Promise<Article[]> => {
  const apiKey = getRequiredApiKey('VITE_GUARDIAN_KEY', 'Guardian API key is missing');

  const url = new URL('https://content.guardianapis.com/search');

  url.searchParams.append('api-key', apiKey);
  url.searchParams.append('show-fields', 'thumbnail,trailText,byline');
  url.searchParams.append('page-size', '20');
  url.searchParams.append('page', '1');
  url.searchParams.append('order-by', 'newest');

  if (params.keyword) {
    url.searchParams.append('q', params.keyword.trim());
  }

  if (params.fromDate) {
    appendParam(url, 'from-date', toISODate(params.fromDate));
  }

  if (params.toDate) {
    appendParam(url, 'to-date', toISODate(params.toDate));
  }

  const section = params.category && guardianSectionByCategory[params.category];
  if (section) {
    url.searchParams.append('section', section);
  }

  const response = await fetch(url.toString());
  const data: GuardianResponse = await response.json();

  if (data.response.status !== 'ok') {
    throw new Error(data.response.message || 'Guardian API request failed');
  }

  if (!data.response.results) {
    return [];
  }

  return data.response.results.map((result) => ({
    id: result.id,
    title: result.webTitle,
    description: result.fields?.trailText ?? null,
    url: result.webUrl,
    imageUrl: result.fields?.thumbnail ?? null,
    publishedAt: result.webPublicationDate,
    source: 'The Guardian',
    category: mapCategory(result.sectionName),
    author: cleanAuthor(result.fields?.byline ?? null, result.webUrl),
  }));
};

export const guardianAdapter: NewsSource = { search };
