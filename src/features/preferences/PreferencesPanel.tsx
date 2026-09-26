import { useState } from 'react';
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
  const [authorInput, setAuthorInput] = useState<string>('');

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

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    const author = authorInput.trim();
    if (author && !preferences.authors.includes(author)) {
      onUpdate({ authors: [...preferences.authors, author] });
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    onUpdate({ authors: preferences.authors.filter((a) => a !== authorToRemove) });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Sources section */}
      <section aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="mb-4 text-base font-semibold tracking-[-0.01em] text-slate-900 dark:text-white"
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
          className="mb-4 text-base font-semibold tracking-[-0.01em] text-slate-900 dark:text-white"
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

      {/* Authors section */}
      <section aria-labelledby="authors-heading">
        <h2
          id="authors-heading"
          className="mb-4 text-base font-semibold tracking-[-0.01em] text-slate-900 dark:text-white"
        >
          Preferred Authors
        </h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Add authors to prioritize their articles. Leave empty to show all authors.
        </p>
        <form onSubmit={handleAddAuthor} className="flex gap-2 mb-4">
          <input
            type="text"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            placeholder="Enter author name..."
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!authorInput.trim()}
            className="cursor-pointer rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
          >
            Add
          </button>
        </form>
        {preferences.authors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferences.authors.map((author) => (
              <span
                key={author}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {author}
                <button
                  type="button"
                  onClick={() => handleRemoveAuthor(author)}
                  className="cursor-pointer rounded-full p-0.5 text-blue-700 transition-colors hover:bg-blue-200 dark:text-blue-300 dark:hover:bg-blue-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Remove ${author}`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Reset */}
      <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-700 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30 dark:focus:ring-offset-slate-900"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
};

export default PreferencesPanel;
