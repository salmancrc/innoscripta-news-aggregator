interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'No articles found' }: EmptyStateProps) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
    <svg
      aria-hidden="true"
      className="mb-4 h-12 w-12 text-slate-400 dark:text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5h15v15h-15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 11.5h8M8 15h5" />
    </svg>
    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{message}</p>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
      Try checking your filters or using a different keyword.
    </p>
  </div>
);

export default EmptyState;
