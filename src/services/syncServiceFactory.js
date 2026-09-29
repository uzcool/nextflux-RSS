import {
  getIncrementalSyncStart,
  mapRemoteFeed,
  mergeRemoteEntries,
} from "../domain/sync/syncData.js";

export function createSyncService({
  api,
  repository,
  mapEntry,
  now = () => new Date(),
  batchSize = 1000,
  historyWindowHours = 24,
}) {
  async function syncFeeds() {
    const [serverFeeds, serverCategories, localFeeds] = await Promise.all([
      api.getFeeds(),
      api.getCategories(),
      repository.getFeeds(),
    ]);

    const serverFeedIds = new Set(serverFeeds.map((feed) => feed.id));
    const removedFeeds = localFeeds.filter(
      (feed) => !serverFeedIds.has(feed.id),
    );
    await Promise.all(
      removedFeeds.map((feed) => repository.deleteArticlesByFeedId(feed.id)),
    );
    await Promise.all([
      repository.deleteAllFeeds(),
      repository.deleteAllCategory(),
    ]);
    await Promise.all(
      serverCategories.map((category) =>
        repository.addCategory({ id: category.id, title: category.title }),
      ),
    );
    await repository.addFeeds(serverFeeds.map(mapRemoteFeed));
  }

  async function syncInitialEntries() {
    let offset = 0;
    const { total } = await api.getUnreadEntriesByPage(0, 1);

    while (offset < total) {
      const { entries } = await api.getUnreadEntriesByPage(offset, batchSize);
      await repository.addArticles(entries.map(mapEntry));
      offset += batchSize;
    }

    const starredEntries = await api.getAllStarredEntries();
    await repository.addArticles(starredEntries.map(mapEntry));
  }

  async function syncIncrementalEntries(lastSyncTime) {
    const since = getIncrementalSyncStart(lastSyncTime, historyWindowHours);
    const [changedEntries, newEntries] = await Promise.all([
      api.getChangedEntries(since),
      api.getNewEntries(since),
    ]);
    const entries = mergeRemoteEntries(changedEntries, newEntries);
    if (entries.length > 0) {
      await repository.addArticles(entries.map(mapEntry));
    }
  }

  async function syncEntries() {
    const lastSyncTime = repository.getLastSyncTime();
    return lastSyncTime
      ? syncIncrementalEntries(lastSyncTime)
      : syncInitialEntries();
  }

  async function synchronize() {
    await syncFeeds();
    await syncEntries();
    const completedAt = now();
    repository.setLastSyncTime(completedAt);
    return completedAt;
  }

  return { synchronize, syncEntries, syncFeeds };
}
