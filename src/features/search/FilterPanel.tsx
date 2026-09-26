import { ConfigProvider, DatePicker, theme } from 'antd';
import dayjs from 'dayjs';
import type { Category, NewsSourceId } from '../../types/source';

const { darkAlgorithm, defaultAlgorithm } = theme;

const { RangePicker } = DatePicker;

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
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const handleClear = () => {
    onCategoryChange(null);
    onSourceChange(null);
    onFromDateChange(null);
    onToDateChange(null);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-800/60 dark:shadow-[0_1px_2px_rgba(15,23,42,0.5),0_14px_30px_rgba(2,6,23,0.7)]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="mb-2 flex flex-col gap-2 sm:flex sm:mb-0">
          <label htmlFor="category-filter" className="text-sm font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
            Category
          </label>
          <div className="flex gap-3 overflow-x-auto px-1 pb-2 pt-0.5 [scrollbar-gutter:stable_both-edges] sm:hidden">
            <button
              type="button"
              aria-pressed={!selectedCategory}
              onClick={() => onCategoryChange(null)}
              className={`shrink-0 cursor-pointer rounded-full border px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                !selectedCategory
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => onCategoryChange(cat)}
                className={`shrink-0 cursor-pointer rounded-full border px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selectedCategory === cat
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <select
            id="category-filter"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange((e.target.value as Category) || null)}
            className="theme-select hidden h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-0 pr-10 text-[0.875rem] leading-[1.5] text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900 sm:block"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2 flex flex-col gap-2 sm:mb-0">
          <label htmlFor="source-filter" className="text-sm font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
            Source
          </label>
          <div className="flex gap-3 overflow-x-auto px-1 pb-2 pt-0.5 [scrollbar-gutter:stable_both-edges] sm:hidden">
            <button
              type="button"
              aria-pressed={!selectedSource}
              onClick={() => onSourceChange(null)}
              className={`shrink-0 cursor-pointer rounded-full border px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                !selectedSource
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {SOURCES.map((src) => (
              <button
                key={src}
                type="button"
                aria-pressed={selectedSource === src}
                onClick={() => onSourceChange(src)}
                className={`shrink-0 cursor-pointer rounded-full border px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selectedSource === src
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {src === 'newsapi' ? 'NewsAPI' : src === 'guardian' ? 'The Guardian' : 'NYT'}
              </button>
            ))}
          </div>
          <select
            id="source-filter"
            value={selectedSource || ''}
            onChange={(e) => onSourceChange((e.target.value as NewsSourceId) || null)}
            className="theme-select hidden h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-0 pr-10 text-[0.875rem] leading-[1.5] text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900 sm:block"
          >
            <option value="">All sources</option>
            {SOURCES.map((src) => (
              <option key={src} value={src}>
                {src === 'newsapi' ? 'NewsAPI' : src === 'guardian' ? 'The Guardian' : 'New York Times'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-2">
          <span className="text-sm font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Published Date</span>
          <ConfigProvider
            theme={{
              algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
              token: isDarkMode
                ? {
                    colorPrimary: '#6366f1',
                    colorPrimaryBg: '#eef2ff',
                    colorBorder: '#475569',
                    colorBgContainer: '#0f172a',
                    colorBgElevated: '#111827',
                    colorText: '#e2e8f0',
                    colorTextPlaceholder: '#94a3b8',
                    colorTextHeading: '#f8fafc',
                    colorTextDisabled: '#64748b',
                    colorSplit: '#334155',
                    borderRadius: 10,
                    controlHeight: 42,
                    controlHeightLG: 42,
                  }
                : {
                    colorPrimary: '#4f46e5',
                    colorPrimaryBg: '#eef2ff',
                    colorBorder: '#cbd5e1',
                    colorBgContainer: '#ffffff',
                    colorBgElevated: '#ffffff',
                    colorText: '#0f172a',
                    colorTextPlaceholder: '#64748b',
                    colorTextHeading: '#0f172a',
                    colorTextDisabled: '#94a3b8',
                    colorSplit: '#e2e8f0',
                    borderRadius: 10,
                    controlHeight: 42,
                    controlHeightLG: 42,
                  },
            }}
          >
            <RangePicker
              className="project-range-picker w-full rounded-[10px] shadow-none min-h-[42px] h-[42px] bg-white dark:bg-slate-700"
              value={
                fromDate && toDate
                  ? [dayjs(fromDate), dayjs(toDate)]
                  : fromDate
                    ? [dayjs(fromDate), dayjs(fromDate)]
                    : toDate
                      ? [dayjs(toDate), dayjs(toDate)]
                      : undefined
              }
              format="YYYY/MM/DD"
              onChange={(dates) => {
                if (!dates || dates[0] == null || dates[1] == null) {
                  onFromDateChange(null);
                  onToDateChange(null);
                  return;
                }

                const [start, end] = dates;
                onFromDateChange(start ? start.format('YYYY-MM-DD') : null);
                onToDateChange(end ? end.format('YYYY-MM-DD') : null);
              }}
            />
          </ConfigProvider>
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
