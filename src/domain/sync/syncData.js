export function mapRemoteFeed(feed) {
  return {
    id: feed.id,
    title: feed.title,
    url: feed.feed_url,
    site_url: feed.site_url,
    crawler: feed.crawler,
    hide_globally: feed.hide_globally,
    categoryId: feed.category.id,
    parsing_error_count: feed.parsing_error_count,
    scraper_rules: feed.scraper_rules,
    keeplist_rules: feed.keeplist_rules,
    blocklist_rules: feed.blocklist_rules,
    rewrite_rules: feed.rewrite_rules,
  };
}

export function mergeRemoteEntries(changedEntries, newEntries) {
  const entriesById = new Map();
  changedEntries.forEach((entry) => entriesById.set(entry.id, entry));
  newEntries.forEach((entry) => entriesById.set(entry.id, entry));
  return [...entriesById.values()];
}

export function getIncrementalSyncStart(lastSyncTime, historyWindowHours) {
  const since = new Date(lastSyncTime);
  since.setHours(since.getHours() - historyWindowHours);
  return since;
}
