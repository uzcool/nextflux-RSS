const isVisibleFeed = (feed, showHiddenFeeds) =>
  showHiddenFeeds || !feed.hide_globally;

const parseScopeId = (id) =>
  id === null || id === undefined ? null : Number.parseInt(id, 10);

export function getArticleFeedIds(
  feeds,
  { type = "all", id = null, showHiddenFeeds = false } = {},
) {
  const parsedId = parseScopeId(id);

  return feeds
    .filter((feed) => isVisibleFeed(feed, showHiddenFeeds))
    .filter((feed) => {
      if (type === "feed") return feed.id === parsedId;
      if (type === "category") return feed.categoryId === parsedId;
      return true;
    })
    .map((feed) => feed.id);
}

export function getAffectedFeedIds(
  feeds,
  { type = "all", id = null, showHiddenFeeds = false } = {},
) {
  const parsedId = parseScopeId(id);

  if (type === "feed") {
    return Number.isInteger(parsedId) ? [parsedId] : [];
  }

  const visibleFeeds = feeds.filter((feed) =>
    isVisibleFeed(feed, showHiddenFeeds),
  );

  if (type === "category") {
    if (!Number.isInteger(parsedId)) return [];

    return visibleFeeds
      .filter((feed) => feed.categoryId === parsedId)
      .map((feed) => feed.id);
  }

  return visibleFeeds.map((feed) => feed.id);
}
