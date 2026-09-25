import { beforeEach, describe, expect, it, vi } from 'vitest';
import { newsApiAdapter } from '../newsApiAdapter';
import type { SearchParams } from '../../../types/source';

const SEARCH_PARAMS: SearchParams = {
  keyword: '',
  category: null,
  source: null,
  fromDate: null,
  toDate: null,
  preferredCategories: [],
  preferredAuthors: [],
};

const stubFetch = () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 'ok', articles: [] }),
    }),
  );
};

describe('newsApiAdapter category filtering', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_NEWSAPI_KEY', 'test-key');
  });

  it('uses category headlines without adding a fallback keyword', async () => {
    stubFetch();

    await newsApiAdapter.search({ ...SEARCH_PARAMS, category: 'technology' });

    const requestUrl = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(requestUrl).toContain('/v2/top-headlines');
    expect(requestUrl).toContain('category=technology');
    expect(requestUrl).not.toContain('q=latest');
  });

  it('rejects category searches combined with date filters', async () => {
    await expect(
      newsApiAdapter.search({
        ...SEARCH_PARAMS,
        category: 'technology',
        fromDate: '2024-03-01',
      }),
    ).rejects.toThrow('NewsAPI supports category and date searches separately');
  });
});
