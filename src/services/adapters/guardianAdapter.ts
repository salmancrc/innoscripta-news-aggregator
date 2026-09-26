import type { Article } from '../../types/article';
import type { Category, SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';
import { cleanAuthor } from '../../lib/utils';

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

const mapCategory = (sectionName: string): Category | null => {
  const lower = sectionName.trim().toLowerCase();
  if (lower.includes('tech')) return 'technology';
  if (lower.includes('science')) return 'science';
  if (
    lower.includes('health') ||
    lower.includes('medical') ||
    lower.includes('life and style') ||
    lower.includes('lifeandstyle') ||
    lower.includes('lifestyle')
  ) {
    return 'health';
  }
  if (lower.includes('business') || lower.includes('money') || lower.includes('economy')) return 'business';
  if (lower.includes('sport')) return 'sports';
  if (
    lower.includes('entertainment') ||
    lower.includes('film') ||
    lower.includes('music') ||
    lower.includes('culture') ||
    lower.includes('arts')
  ) {
    return 'entertainment';
  }
  if (lower.includes('news') || lower.includes('world') || lower.includes('uk') || lower.includes('global') || lower.includes('politic')) return 'general';
  return null;
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
  const apiKey = import.meta.env.VITE_GUARDIAN_KEY;
  if (!apiKey) {
    throw new Error('Guardian API key is missing');
  }

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
    url.searchParams.append('from-date', params.fromDate.split('T')[0]);
  }

  if (params.toDate) {
    url.searchParams.append('to-date', params.toDate.split('T')[0]);
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
