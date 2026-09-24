interface ErrorBannerProps {
  errors?: Record<string, string>;
}

const formatSourceName = (sourceId: string): string => {
  if (sourceId === 'newsapi') return 'NewsAPI';
  if (sourceId === 'nyt') return 'New York Times';

  return sourceId.charAt(0).toUpperCase() + sourceId.slice(1);
};

const ErrorBanner = ({ errors }: ErrorBannerProps) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <aside
      role="alert"
      aria-live="polite"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <p className="font-semibold">Some sources could not be loaded</p>
      <ul className="mt-2 space-y-1 text-sm">
        {Object.entries(errors).map(([sourceId, message]) => (
          <li key={sourceId}>
            <span className="font-medium">{formatSourceName(sourceId)}:</span> {message}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ErrorBanner;
