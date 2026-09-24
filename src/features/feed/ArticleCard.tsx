import { useState } from 'react';
import type { Article } from '../../types/article';

export interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article
      role="article"
      className="flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100 dark:border-slate-700"
    >
      {article.imageUrl && !imageError && (
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-48 sm:h-56 object-cover"
        />
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
