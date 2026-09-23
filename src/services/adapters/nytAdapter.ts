import type { Article } from '../../types/article';
import type { SearchParams } from '../../types/source';
import type { NewsSource } from '../newsSource';

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
  };
  fault?: {
    faultstring: string;
  };
}

const formatDate = (dateStr: string): string => {
  return dateStr.split('T')[0].replace(/-/g, '');
};

const search = async (params: SearchParams): Promise<Article[]> => {
  const apiKey = import.meta.env.VITE_NYT_KEY;
  if (!apiKey) {
    throw new Error('NYT API key is missing');
  }

  const url = new URL('https://api.nytimes.com/svc/search/v2/articlesearch.json');
  
  url.searchParams.append('api-key', apiKey);

  if (params.keyword) {
    url.searchParams.append('q', params.keyword.trim());
  }

  if (params.fromDate) {
    url.searchParams.append('begin_date', formatDate(params.fromDate));
  }
  
  if (params.toDate) {
    url.searchParams.append('end_date', formatDate(params.toDate));
  }
  
  if (params.category) {
    // Note: If using specific Category mappings, NYT has its own sections,
    // we assume params.category matches NYT's expectations or falls back gracefully.
    url.searchParams.append('fq', `section_name:("${params.category}")`);
  }

  const response = await fetch(url.toString());
  const data: NYTResponse = await response.json();

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

    return {
      id: doc._id,
      title: doc.headline?.main ?? '',
      description: doc.abstract ?? null,
      url: doc.web_url,
      imageUrl,
      publishedAt: doc.pub_date,
      source: 'New York Times',
      category: doc.section_name?.toLowerCase() ?? null,
      author,
    };
  });
};

export const nytAdapter: NewsSource = { search };
