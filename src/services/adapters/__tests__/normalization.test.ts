import { describe, it, expect, vi, beforeEach } from 'vitest';
import { guardianAdapter } from '../guardianAdapter';
import type { SearchParams } from '../../../types/source';

const SEARCH_PARAMS: SearchParams = {
  keyword: 'test',
  category: null,
  source: null,
  fromDate: null,
  toDate: null,
  preferredCategories: [],
  preferredAuthors: [],
};

const makeGuardianResponse = (overrides?: object) => ({
  response: {
    status: 'ok',
    results: [
      {
        id: 'tech/article-1',
        webTitle: 'Test Article',
        webUrl: 'https://theguardian.com/test',
        webPublicationDate: '2024-01-15T10:00:00Z',
        sectionName: 'Technology',
        fields: {
          thumbnail: 'https://img.com/1.jpg',
          trailText: 'A description',
          byline: 'John Doe',
        },
        ...overrides,
      },
    ],
  },
});

const stubFetch = (body: object, ok = true) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(body),
    }),
  );
};

describe('guardianAdapter normalization', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GUARDIAN_KEY', 'test-key');
  });

  it('maps a full Guardian result to the Article interface correctly', async () => {
    stubFetch(makeGuardianResponse());

    const articles = await guardianAdapter.search(SEARCH_PARAMS);

    expect(articles).toHaveLength(1);

    const article = articles[0];
    expect(article.id).toBe('tech/article-1');
    expect(article.source).toBe('The Guardian');
    expect(article.author).toBe('John Doe');
    expect(article.imageUrl).toBe('https://img.com/1.jpg');
    expect(article.category).toBe('technology');
    expect(article.title).toBe('Test Article');
    expect(article.description).toBe('A description');
    expect(article.url).toBe('https://theguardian.com/test');
    expect(article.publishedAt).toBe('2024-01-15T10:00:00Z');
  });

  it('returns null for imageUrl and author when fields is absent', async () => {
    stubFetch(
      makeGuardianResponse({ fields: undefined }),
    );

    const articles = await guardianAdapter.search(SEARCH_PARAMS);

    expect(articles).toHaveLength(1);
    expect(articles[0].imageUrl).toBeNull();
    expect(articles[0].author).toBeNull();
  });

  it('requests newest Guardian results first', async () => {
    stubFetch(makeGuardianResponse());

    await guardianAdapter.search(SEARCH_PARAMS);

    const requestUrl = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(requestUrl).toContain('order-by=newest');
  });

  it('throws when the API returns status !== ok', async () => {
    stubFetch({ response: { status: 'error', message: 'API error' } });

    await expect(guardianAdapter.search(SEARCH_PARAMS)).rejects.toThrow('API error');
  });
});
