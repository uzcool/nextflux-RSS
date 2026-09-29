export function getUnreadArticlesInRange(articles, articleId, direction) {
  const articleIndex = articles.findIndex(
    (article) => article.id === articleId,
  );

  if (articleIndex < 0) return [];
  if (direction === "below" && articleIndex >= articles.length - 1) return [];

  const range =
    direction === "above"
      ? articles.slice(0, articleIndex + 1)
      : articles.slice(articleIndex);

  return range.filter((article) => article.status !== "read");
}

export function countArticlesByFeed(articles) {
  return articles.reduce((counts, article) => {
    counts[article.feedId] = (counts[article.feedId] || 0) + 1;
    return counts;
  }, {});
}
