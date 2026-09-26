import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nytAdapter } from '../nytAdapter';
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

describe('nytAdapter category filtering', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_NYT_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'OK', response: { docs: [] } }),
      }),
    );
  });

  it('builds a valid NYT fq filter with quoted section names', async () => {
    await nytAdapter.search({ ...SEARCH_PARAMS, category: 'health' });

    const requestUrl = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(requestUrl).toContain('api-key=test-key');
    expect(requestUrl).toContain('sort=newest');
    expect(requestUrl).toContain('fq=section_name%3A%28%22Health%22%29');
  });
});
