export function cleanAuthor(author: string | null, url?: string): string | null {
  if (!author) return null;

  if (author.toLowerCase().includes('facebook.com/bbcnews') || url?.toLowerCase().includes('facebook.com/bbcnews')) {
    return 'BBC News';
  }

  const withoutEmail = author.replace(/\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*/g, ' ');
  const withoutBy = withoutEmail.replace(/^By\s+/i, '');
  const cleaned = withoutBy.replace(/\s+/g, ' ').trim();

  return cleaned || null;
}

export function capitalizeCategory(category: string | null): string | null {
  if (!category) return null;
  return category.charAt(0).toUpperCase() + category.slice(1);
}
