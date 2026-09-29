export function getArticleBasePath(pathname) {
  return pathname.split("/article/")[0] || "/";
}

export function getAdjacentArticle(articles, activeArticleId, direction) {
  const index = articles.findIndex(({ id }) => id === activeArticleId);
  const targetIndex = direction === "previous" ? index - 1 : index + 1;
  return targetIndex >= 0 && targetIndex < articles.length
    ? articles[targetIndex]
    : null;
}
