import { Link } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences';
import PreferencesPanel from '../features/preferences/PreferencesPanel';

const PreferencesPage = () => {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            to="/"
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span aria-hidden="true">←</span>
            Back to feed
          </Link>
        </div>

        <h1 className="mb-8 text-3xl font-bold tracking-[-0.03em]">Your Preferences</h1>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <PreferencesPanel
            preferences={preferences}
            onUpdate={updatePreferences}
            onReset={resetPreferences}
          />
        </div>
      </div>
    </main>
  );
};

export default PreferencesPage;
