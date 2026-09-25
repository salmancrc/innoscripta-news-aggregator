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
    <article
      role="article"
      className="flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100 dark:border-slate-700"
    >
      {hasImage ? (
        <img
          src={article.imageUrl!}
          alt={article.title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-48 sm:h-56 object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label="No article image available"
          className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-950 via-slate-800 to-slate-900 sm:h-56"
        >
          <svg aria-hidden="true" className="h-12 w-12 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9" r="1.5" />
            <path d="m3 16 4.5-4 3.5 3 2.5-2 7.5 5" />
          </svg>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white leading-tight">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read full article: ${article.title}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {article.title}
          </a>
        </h2>

        {article.description && (
          <p className="text-slate-600 dark:text-slate-300 line-clamp-3 text-sm leading-relaxed">
            {article.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <time dateTime={article.publishedAt}>{formattedDate}</time>
          <span className="flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:bg-slate-300 dark:before:bg-slate-600">
            {article.source}
          </span>
          {article.category && (
            <span className="flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:bg-slate-300 dark:before:bg-slate-600">
              {capitalizeCategory(article.category)}
            </span>
          )}
          {article.author && (
            <span className="flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:bg-slate-300 dark:before:bg-slate-600 line-clamp-1">
              {article.author}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
