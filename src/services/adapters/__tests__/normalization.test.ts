import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const makeGuardianResponse = (overrides?: Record<string, unknown>) => ({
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

describe('guardianAdapter normalization', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GUARDIAN_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn());
  });

  it('maps a full Guardian result to the Article interface correctly', async () => {
    vi.mocked(fetch as typeof fetch).mockResolvedValue({
      json: async () => makeGuardianResponse(),
    } as Response);

    const articles = await guardianAdapter.search(SEARCH_PARAMS);

    expect(articles).toHaveLength(1);
    expect(articles[0].id).toBe('tech/article-1');
    expect(articles[0].source).toBe('The Guardian');
    expect(articles[0].author).toBe('John Doe');
    expect(articles[0].imageUrl).toBe('https://img.com/1.jpg');
    expect(articles[0].category).toBe('technology');
  });

  it('returns null for imageUrl and author when fields is absent', async () => {
    vi.mocked(fetch as typeof fetch).mockResolvedValue({
      json: async () => makeGuardianResponse({ fields: undefined }),
    } as Response);

    const articles = await guardianAdapter.search(SEARCH_PARAMS);

    expect(articles).toHaveLength(1);
    expect(articles[0].imageUrl).toBeNull();
    expect(articles[0].author).toBeNull();
  });
});
