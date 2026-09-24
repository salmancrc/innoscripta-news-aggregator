import type { UserPreferences, NewsSourceId, Category } from '../../types/source';

export interface PreferencesPanelProps {
  preferences: UserPreferences;
  onUpdate: (partial: Partial<UserPreferences>) => void;
  onReset: () => void;
}

const SOURCES: { id: NewsSourceId; label: string }[] = [
  { id: 'newsapi', label: 'NewsAPI' },
  { id: 'guardian', label: 'The Guardian' },
  { id: 'nyt', label: 'New York Times' },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
  { id: 'business', label: 'Business' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
];

export const PreferencesPanel = ({
  preferences,
  onUpdate,
  onReset,
}: PreferencesPanelProps) => {
  const handleSourceChange = (id: NewsSourceId, checked: boolean) => {
    const updatedSources = checked
      ? [...preferences.sources, id]
      : preferences.sources.filter((s) => s !== id);
    onUpdate({ sources: updatedSources });
  };

  const handleCategoryChange = (id: Category, checked: boolean) => {
    const updatedCategories = checked
      ? [...preferences.categories, id]
      : preferences.categories.filter((c) => c !== id);
    onUpdate({ categories: updatedCategories });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Sources section */}
      <section aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="mb-4 text-lg font-semibold text-slate-900 dark:text-white"
        >
          Preferred Sources
        </h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          At least one source must remain selected.
        </p>
        <div className="flex flex-col gap-3">
          {SOURCES.map(({ id, label }) => {
            const isChecked = preferences.sources.includes(id);
            const isLastChecked = isChecked && preferences.sources.length === 1;
            return (
              <div key={id} className="flex items-center gap-3">
                <input
                  id={`source-${id}`}
                  type="checkbox"
                  checked={isChecked}
                  disabled={isLastChecked}
                  onChange={(e) => handleSourceChange(id, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600"
                />
                <label
                  htmlFor={`source-${id}`}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 aria-disabled:opacity-50"
                  aria-disabled={isLastChecked}
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories section */}
      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="mb-4 text-lg font-semibold text-slate-900 dark:text-white"
        >
          Preferred Categories
        </h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Leave all unchecked to show articles from every category.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map(({ id, label }) => (
            <div key={id} className="flex items-center gap-3">
              <input
                id={`category-${id}`}
                type="checkbox"
                checked={preferences.categories.includes(id)}
                onChange={(e) => handleCategoryChange(id, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
              />
              <label
                htmlFor={`category-${id}`}
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Reset */}
      <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus:ring-offset-slate-900"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
};

export default PreferencesPanel;
