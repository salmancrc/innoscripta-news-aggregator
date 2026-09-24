import { useState, useCallback } from 'react';
import type { UserPreferences } from '../types/source';
import { getItem, setItem } from '../lib/storage';

const STORAGE_KEY = 'news_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  sources: ['newsapi', 'guardian', 'nyt'],
  categories: [],
  authors: [],
};

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() =>
    getItem<UserPreferences>(STORAGE_KEY, DEFAULT_PREFERENCES)
  );

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferencesState((prev) => {
      const next = { ...prev, ...partial };
      setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferencesState(DEFAULT_PREFERENCES);
    setItem(STORAGE_KEY, DEFAULT_PREFERENCES);
  }, []);

  return { preferences, updatePreferences, resetPreferences };
}

export default usePreferences;
