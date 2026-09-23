import type { Article } from '../types/article';
import type { SearchParams } from '../types/source';

export interface NewsSource {
  search(params: SearchParams): Promise<Article[]>;
}
