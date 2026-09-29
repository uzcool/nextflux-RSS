import {
  addArticles,
  getArticlesByPage,
  getArticlesCount,
  getFeeds,
  getStarredCount,
  getUnreadCount,
} from "@/db/storage.js";
import {
  updateEntryStarred,
  updateEntryStatus,
} from "@/api/resources/entries.js";
import { getArticleFeedIds } from "@/domain/articles/articleScope.js";

const remoteUpdate = (operation) =>
  navigator.onLine ? operation() : Promise.resolve();

export async function loadArticlePage({
  sourceId,
  type,
  page,
  pageSize,
  filter,
  settings,
}) {
  const storedFeeds = await getFeeds();
  const feedIds = getArticleFeedIds(storedFeeds, {
    type,
    id: sourceId,
    showHiddenFeeds: settings.showHiddenFeeds,
  });

  const [total, articles] = await Promise.all([
    getArticlesCount(feedIds, filter),
    getArticlesByPage(
      feedIds,
      filter,
      page,
      pageSize,
      settings.sortDirection,
      settings.sortField,
    ),
  ]);

  return { articles, total, isMore: articles.length === pageSize };
}

export async function persistArticleStatus(article, status) {
  await Promise.all([
    remoteUpdate(() => updateEntryStatus(article)),
    addArticles([{ ...article, status }]),
  ]);
  return getUnreadCount(article.feedId);
}

export async function persistArticleStarred(article, starred) {
  await Promise.all([
    remoteUpdate(() => updateEntryStarred(article)),
    addArticles([{ ...article, starred }]),
  ]);
  return getStarredCount(article.feedId);
}

export async function persistArticlesAsRead(articles) {
  await Promise.all([
    remoteUpdate(() =>
      Promise.all(articles.map((article) => updateEntryStatus(article))),
    ),
    addArticles(articles.map((article) => ({ ...article, status: "read" }))),
  ]);
}
