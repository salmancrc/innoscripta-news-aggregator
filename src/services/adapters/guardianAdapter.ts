import type { Article } from '../../types/article';
import type { SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';

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
  };
}

const mapCategory = (sectionName: string): string | null => {
  const lower = sectionName.toLowerCase();
  if (lower.includes('tech')) return 'technology';
  if (lower.includes('science')) return 'science';
  if (lower.includes('health') || lower.includes('medical')) return 'health';
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
  if (lower.includes('news') || lower.includes('world') || lower.includes('uk') || lower.includes('global')) return 'general';
  return null;
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

  if (params.keyword) {
    url.searchParams.append('q', params.keyword.trim());
  }
  
  if (params.fromDate) {
    url.searchParams.append('from-date', params.fromDate.split('T')[0]);
  }
  
  if (params.toDate) {
    url.searchParams.append('to-date', params.toDate.split('T')[0]);
  }
  
  if (params.category) {
    url.searchParams.append('section', params.category);
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
    author: result.fields?.byline ?? null,
  }));
};

export const guardianAdapter: NewsSource = { search };
