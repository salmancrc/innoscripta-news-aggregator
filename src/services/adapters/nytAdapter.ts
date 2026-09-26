import type { Article } from '../../types/article';
import type { Category, SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';
import { cleanAuthor } from '../../lib/utils';
import { appendParam, getRequiredApiKey, toNYTDate } from '../api';

interface NYTMultimediaItem {
  subtype: string;
  url: string;
}

interface NYTMultimediaImage {
  url: string;
}

interface NYTMultimediaObject {
  default?: NYTMultimediaImage;
  thumbnail?: NYTMultimediaImage;
}

interface NYTArticle {
  _id: string;
  headline: {
    main: string;
  };
  abstract?: string | null;
  web_url: string;
  multimedia?: NYTMultimediaItem[] | NYTMultimediaObject;
  pub_date: string;
  section_name?: string | null;
  byline?: {
    original?: string | null;
  };
}

interface NYTResponse {
  status: string;
  response?: {
    docs: NYTArticle[];
    meta?: {
      hits?: number;
      offset?: number;
    };
  };
  fault?: {
    faultstring: string;
  };
}

const nytSectionsByCategory: Partial<Record<Category, string[]>> = {
  technology: ['Technology'],
  science: ['Science'],
  health: ['Health'],
  business: ['Business'],
  sports: ['Sports'],
  entertainment: ['Arts', 'Movies', 'Theater', 'Books'],
  general: ['U.S.', 'World', 'Politics'],
};

const NYT_CATEGORY_MAP: Record<string, Category> = {
  technology: 'technology',
  science: 'science',
  health: 'health',
  business: 'business',
  sports: 'sports',
  sport: 'sports',
  arts: 'entertainment',
  movies: 'entertainment',
  theater: 'entertainment',
  books: 'entertainment',
  'u.s.': 'general',
  us: 'general',
  world: 'general',
  politics: 'general',
};

const mapNytCategory = (sectionName: string): Category | null => {
  const section = sectionName.trim().toLowerCase();
  return NYT_CATEGORY_MAP[section] ?? null;
};

const buildSectionFilter = (sections: string[]): string => {
  const escapedSections = sections.map((section) => `"${section.replace(/"/g, '\\"')}"`);
  return `section_name:(${escapedSections.join(' OR ')})`;
};

const search = async (params: SearchParams): Promise<Article[]> => {
  const apiKey = getRequiredApiKey('VITE_NYT_KEY', 'NYT API key is missing');

  const url = new URL('https://api.nytimes.com/svc/search/v2/articlesearch.json');

  url.searchParams.append('api-key', apiKey);
  url.searchParams.append('page', '0');
  url.searchParams.append('sort', 'newest');

  if (params.keyword) {
    url.searchParams.append('q', params.keyword.trim());
  }

  if (params.fromDate) {
    appendParam(url, 'begin_date', toNYTDate(params.fromDate));
  }

  if (params.toDate) {
    appendParam(url, 'end_date', toNYTDate(params.toDate));
  }

  if (params.category) {
    const sections = nytSectionsByCategory[params.category];
    if (sections?.length) {
      url.searchParams.set('fq', buildSectionFilter(sections));
    }
  }

  const response = await fetch(url.toString());
  const data: NYTResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.fault?.faultstring || 'NYT API request failed');
  }

  if (data.status !== 'OK') {
    throw new Error(data.fault?.faultstring || 'NYT API request failed');
  }

  if (!data.response?.docs) {
    return [];
  }

  return data.response.docs.map((doc) => {
    let imageUrl = null;

    if (Array.isArray(doc.multimedia)) {
      const xlargeImg = doc.multimedia.find((m) => m.subtype === 'xlarge');
      if (xlargeImg?.url) {
        imageUrl = `https://www.nytimes.com/${xlargeImg.url.replace(/^\//, '')}`;
      }
    } else if (doc.multimedia?.default?.url) {
      imageUrl = doc.multimedia.default.url;
    }

    let author = doc.byline?.original ?? null;
    if (author) {
      author = author.replace(/^By\s+/i, '').trim();
    }
    author = cleanAuthor(author, doc.web_url);

    return {
      id: doc._id,
      title: doc.headline?.main ?? '',
      description: doc.abstract ?? null,
      url: doc.web_url,
      imageUrl,
      publishedAt: doc.pub_date,
      source: 'New York Times',
      category: doc.section_name ? mapNytCategory(doc.section_name) : null,
      author,
    };
  });
};

export const nytAdapter: NewsSource = { search };
