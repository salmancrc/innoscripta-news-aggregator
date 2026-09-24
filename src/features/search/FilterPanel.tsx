import type { Category, NewsSourceId } from '../../types/source';

export interface FilterPanelProps {
  selectedCategory: Category | null;
  selectedSource: NewsSourceId | null;
  fromDate: string | null;
  toDate: string | null;
  onCategoryChange: (v: Category | null) => void;
  onSourceChange: (v: NewsSourceId | null) => void;
  onFromDateChange: (v: string | null) => void;
  onToDateChange: (v: string | null) => void;
}

const CATEGORIES: Category[] = [
  'general',
  'technology',
  'science',
  'health',
  'business',
  'sports',
  'entertainment',
];

const SOURCES: NewsSourceId[] = ['newsapi', 'guardian', 'nyt'];

export const FilterPanel = ({
  selectedCategory,
  selectedSource,
  fromDate,
  toDate,
  onCategoryChange,
  onSourceChange,
  onFromDateChange,
  onToDateChange,
}: FilterPanelProps) => {
  const handleClear = () => {
    onCategoryChange(null);
    onSourceChange(null);
    onFromDateChange(null);
    onToDateChange(null);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="category-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange((e.target.value as Category) || null)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="source-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Source
          </label>
          <select
            id="source-filter"
            value={selectedSource || ''}
            onChange={(e) => onSourceChange((e.target.value as NewsSourceId) || null)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">All sources</option>
            {SOURCES.map((src) => (
              <option key={src} value={src}>
                {src === 'newsapi' ? 'NewsAPI' : src === 'guardian' ? 'The Guardian' : 'New York Times'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="from-date-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            From Date
          </label>
          <input
            id="from-date-filter"
            type="date"
            value={fromDate || ''}
            onChange={(e) => onFromDateChange(e.target.value || null)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="to-date-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            To Date
          </label>
          <input
            id="to-date-filter"
            type="date"
            value={toDate || ''}
            onChange={(e) => onToDateChange(e.target.value || null)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-800"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
