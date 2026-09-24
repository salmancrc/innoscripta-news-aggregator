import ArticleCard from './ArticleCard';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import type { Article } from '../../types/article';

export interface ArticleFeedProps {
  articles: Article[];
  isLoading: boolean;
}

const ArticleFeed = ({ articles, isLoading }: ArticleFeedProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <section
      aria-label="Articles"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </section>
  );
};

export default ArticleFeed;
