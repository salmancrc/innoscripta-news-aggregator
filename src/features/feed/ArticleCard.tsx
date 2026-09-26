import { useState } from 'react';
import type { Article } from '../../types/article';
import { capitalizeCategory } from '../../lib/utils';

export interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(article.publishedAt));

  const hasImage = Boolean(article.imageUrl) && !imageError;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read full article: ${article.title}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(79,70,229,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_1px_2px_rgba(2,6,23,0.5),0_18px_40px_rgba(15,23,42,0.6)] dark:hover:shadow-[0_22px_48px_rgba(99,102,241,0.18)] dark:focus-visible:ring-offset-slate-900"
    >
      <article role="article" className="flex flex-col">
        {hasImage ? (
          <div className="overflow-hidden bg-slate-200 transition-transform duration-500 ease-out group-hover:scale-[1.02] dark:bg-slate-700">
            <img
              src={article.imageUrl!}
              alt={article.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="aspect-video w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div
            role="img"
            aria-label="No article image available"
            className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 text-slate-500 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 dark:text-slate-400"
          >
            <svg aria-hidden="true" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9" r="1.5" />
              <path d="m3 16 4.5-4 3.5 3 2.5-2 7.5 5" />
            </svg>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h2 className="line-clamp-2 text-[1.05rem] font-semibold leading-tight tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {article.title}
          </h2>

          {article.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {article.description}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 text-[0.7rem] font-medium tracking-[0.02em] text-slate-500 dark:text-slate-400">
            <time dateTime={article.publishedAt}>{formattedDate}</time>
            <span className="flex items-center gap-1.5 before:block before:h-1 before:w-1 before:rounded-full before:bg-slate-300 before:content-[''] dark:before:bg-slate-600">
              {article.source}
            </span>
            {article.category && (
              <span className="flex items-center gap-1.5 before:block before:h-1 before:w-1 before:rounded-full before:bg-slate-300 before:content-[''] dark:before:bg-slate-600">
                {capitalizeCategory(article.category)}
              </span>
            )}
            {article.author && (
              <span className="line-clamp-1 flex items-center gap-1.5 before:block before:h-1 before:w-1 before:rounded-full before:bg-slate-300 before:content-[''] dark:before:bg-slate-600">
                {article.author}
              </span>
            )}
          </div>
        </div>
      </article>
    </a>
  );
};

export default ArticleCard;
