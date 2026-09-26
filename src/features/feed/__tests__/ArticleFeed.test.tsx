import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArticleFeed from '../ArticleFeed';
import type { Article } from '../../../types/article';

vi.mock('../ArticleCard', () => ({
  default: ({ article }: { article: Article }) => (
    <div data-testid="article-card">{article.title}</div>
  ),
}));

vi.mock('../../../components/LoadingState', () => ({
  default: () => <div data-testid="loading-state">Loading…</div>,
}));

vi.mock('../../../components/EmptyState', () => ({
  default: () => <div data-testid="empty-state">No articles</div>,
}));

const makeArticle = (id: string): Article => ({
  id,
  title: `Article ${id}`,
  description: null,
  url: `https://example.com/${id}`,
  imageUrl: null,
  publishedAt: '2024-01-01T00:00:00Z',
  source: 'Test',
  category: null,
  author: null,
});

describe('ArticleFeed', () => {
  it('renders LoadingState when isLoading is true', () => {
    render(<ArticleFeed articles={[]} isLoading={true} />);

    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
  });

  it('renders EmptyState when articles is empty and isLoading is false', () => {
    render(<ArticleFeed articles={[]} isLoading={false} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
  });

  it('renders the correct number of ArticleCard elements when articles has items', () => {
    const articles = [makeArticle('a'), makeArticle('b'), makeArticle('c')];

    render(<ArticleFeed articles={articles} isLoading={false} />);

    expect(screen.getAllByTestId('article-card')).toHaveLength(3);
  });
});
