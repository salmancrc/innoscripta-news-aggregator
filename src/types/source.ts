export type NewsSourceId = 'newsapi' | 'guardian' | 'nyt';

export type Category =
  | 'general'
  | 'technology'
  | 'science'
  | 'health'
  | 'business'
  | 'sports'
  | 'entertainment';

export interface SearchParams {
  keyword: string;
  category: Category | null;
  source: NewsSourceId | null;
  fromDate: string | null;
  toDate: string | null;
}

export interface UserPreferences {
  sources: NewsSourceId[];
  categories: Category[];
  authors: string[];
}
