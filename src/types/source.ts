export type NewsSourceId = 'newsapi' | 'guardian' | 'nyt';

export type Category =
  | 'general'
  | 'technology'
  | 'science'
  | 'health'
  | 'business'
  | 'sports'
  | 'entertainment';

export const CATEGORY_OPTIONS: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
  { id: 'business', label: 'Business' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
];

export const SOURCE_OPTIONS: { id: NewsSourceId; label: string }[] = [
  { id: 'newsapi', label: 'NewsAPI' },
  { id: 'guardian', label: 'The Guardian' },
  { id: 'nyt', label: 'New York Times' },
];

export const ALL_CATEGORIES: Category[] = CATEGORY_OPTIONS.map(({ id }) => id);
export const ALL_SOURCES: NewsSourceId[] = SOURCE_OPTIONS.map(({ id }) => id);

export const getCategoryLabel = (category: Category): string =>
  CATEGORY_OPTIONS.find(({ id }) => id === category)?.label ?? category;

export const getSourceLabel = (source: NewsSourceId): string =>
  SOURCE_OPTIONS.find(({ id }) => id === source)?.label ?? source;

export interface SearchParams {
  keyword: string;
  category: Category | null;
  source: NewsSourceId | null;
  fromDate: string | null;
  toDate: string | null;
  preferredCategories: Category[];
  preferredAuthors: string[];
}

export interface UserPreferences {
  sources: NewsSourceId[];
  categories: Category[];
  authors: string[];
}
