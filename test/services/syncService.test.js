import test from "node:test";
import assert from "node:assert/strict";

import { createSyncService } from "../../src/services/syncServiceFactory.js";

function createRepository(overrides = {}) {
  const calls = { articles: [], deletedFeedIds: [] };
  return {
    calls,
    getFeeds: async () => [{ id: 1 }, { id: 99 }],
    deleteArticlesByFeedId: async (id) => calls.deletedFeedIds.push(id),
    deleteAllFeeds: async () => {},
    deleteAllCategory: async () => {},
    addCategory: async () => {},
    addFeeds: async () => {},
    addArticles: async (articles) => calls.articles.push(articles),
    getLastSyncTime: () => null,
    setLastSyncTime: (time) => {
      calls.completedAt = time;
    },
    ...overrides,
  };
}

test("runs feed cleanup and initial entry synchronization", async () => {
  const repository = createRepository();
  const completedAt = new Date("2026-09-29T00:00:00Z");
  const api = {
    getFeeds: async () => [
      { id: 1, title: "Feed", feed_url: "url", category: { id: 10 } },
    ],
    getCategories: async () => [{ id: 10, title: "Category" }],
    getUnreadEntriesByPage: async (offset, limit) =>
      limit === 1
        ? { total: 1 }
        : { entries: [{ id: offset + 1, feed: { id: 1 } }] },
    getAllStarredEntries: async () => [{ id: 2, feed: { id: 1 } }],
  };
  const service = createSyncService({
    api,
    repository,
    mapEntry: (entry) => ({ ...entry, mapped: true }),
    now: () => completedAt,
  });

  assert.equal(await service.synchronize(), completedAt);
  assert.deepEqual(repository.calls.deletedFeedIds, [99]);
  assert.deepEqual(
    repository.calls.articles.flat().map(({ id }) => id),
    [1, 2],
  );
  assert.equal(repository.calls.completedAt, completedAt);
});

test("deduplicates incremental entries with the newest response winning", async () => {
  const repository = createRepository({
    getLastSyncTime: () => new Date("2026-09-29T00:00:00Z"),
  });
  const api = {
    getChangedEntries: async () => [{ id: 1, title: "changed" }],
    getNewEntries: async () => [
      { id: 1, title: "new" },
      { id: 2, title: "second" },
    ],
  };
  const service = createSyncService({
    api,
    repository,
    mapEntry: (entry) => entry,
  });

  await service.syncEntries();
  assert.deepEqual(repository.calls.articles[0], [
    { id: 1, title: "new" },
    { id: 2, title: "second" },
  ]);
});
