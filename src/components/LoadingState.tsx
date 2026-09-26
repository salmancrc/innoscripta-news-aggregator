const LoadingState = () => (
  <div
    aria-busy="true"
    aria-label="Loading articles"
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="aspect-video bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingState;
