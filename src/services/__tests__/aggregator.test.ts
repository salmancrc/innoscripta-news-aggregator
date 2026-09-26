import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Article } from '../../types/article';
import type { SearchParams } from '../../types/source';

vi.mock('../adapters/newsApiAdapter', () => ({
  newsApiAdapter: { search: vi.fn() },
}));
vi.mock('../adapters/guardianAdapter', () => ({
  guardianAdapter: { search: vi.fn() },
}));
vi.mock('../adapters/nytAdapter', () => ({
  nytAdapter: { search: vi.fn() },
}));

import { fetchArticles } from '../aggregator';
import { newsApiAdapter } from '../adapters/newsApiAdapter';
import { guardianAdapter } from '../adapters/guardianAdapter';
import { nytAdapter } from '../adapters/nytAdapter';

const minimalArticle = (overrides: Partial<Article>): Article => ({
  id: 'fallback-id',
  title: 'Fallback',
  description: null,
  url: `https://example.com/${overrides.id ?? 'fallback'}`,
  imageUrl: null,
  publishedAt: '2024-01-01T00:00:00Z',
  source: 'Test',
  category: null,
  author: null,
  ...overrides,
});

const SEARCH_PARAMS: SearchParams = {
  keyword: '',
  category: null,
  source: null,
  fromDate: null,
  toDate: null,
  preferredCategories: [],
  preferredAuthors: [],
};

describe('fetchArticles aggregator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns articles from healthy sources even when one adapter rejects', async () => {
    vi.mocked(newsApiAdapter.search).mockResolvedValue([
      minimalArticle({ id: '1', title: 'From NewsAPI', url: 'https://newsapi.com/1' }),
    ]);
    vi.mocked(guardianAdapter.search).mockRejectedValue(new Error('Guardian down'));
    vi.mocked(nytAdapter.search).mockResolvedValue([
      minimalArticle({ id: '2', title: 'From NYT', url: 'https://nytimes.com/2' }),
    ]);

    const result = await fetchArticles(SEARCH_PARAMS, []);

    expect(result.articles).toHaveLength(2);
    expect(result.articles.map((a) => a.title)).toContain('From NewsAPI');
    expect(result.articles.map((a) => a.title)).toContain('From NYT');
    expect(result.errors['guardian']).toBeDefined();
    expect(result.errors['guardian']).toContain('Guardian down');
  });
});
