import { db } from "@/db/database.js";
import { reportError } from "@/lib/errors.js";

export const addArticles = (articles) => db.articles.bulkPut(articles);

export function markUnreadArticlesAsRead(feedIds) {
  const targetFeedIds = new Set(feedIds.map(Number));
  if (targetFeedIds.size === 0) return 0;

  return db.articles
    .where("status")
    .equals("unread")
    .and((article) => targetFeedIds.has(article.feedId))
    .modify({ status: "read" });
}

export const deleteArticlesByFeedId = (feedId) =>
  db.articles.where("feedId").equals(feedId).delete();

export const getUnreadCount = (feedId) =>
  db.articles.where(["status", "feedId"]).equals(["unread", feedId]).count();

export const getStarredCount = (feedId) =>
  db.articles.where(["starred", "feedId"]).equals([1, feedId]).count();

export function getArticlesCount(feedIds, filter = "all") {
  let query;
  if (filter === "unread") {
    query = db.articles
      .where("feedId")
      .anyOf(feedIds)
      .and((article) => article.status === "unread");
  } else if (filter === "starred") {
    query = db.articles
      .where("feedId")
      .anyOf(feedIds)
      .and((article) => article.starred === 1);
  } else {
    query = db.articles
      .where("feedId")
      .anyOf(feedIds)
      .and((article) => article.status !== "removed");
  }
  return query.count();
}

export async function getArticlesByPage(
  feedIds,
  filter = "all",
  page = 1,
  pageSize = 30,
  sortDirection = "desc",
  sortField = "published_at",
) {
  const offset = (page - 1) * pageSize;
  let collection;

  if (filter === "unread") {
    collection = db.articles
      .where("status")
      .equals("unread")
      .and((article) => feedIds.includes(article.feedId));
  } else if (filter === "starred") {
    collection = db.articles
      .where("starred")
      .equals(1)
      .and((article) => feedIds.includes(article.feedId));
  } else {
    collection = db.articles
      .where("feedId")
      .anyOf(feedIds)
      .and((article) => article.status !== "removed");
  }

  const articles = await collection.sortBy(sortField);
  const sorted = sortDirection === "desc" ? articles.reverse() : articles;
  return sorted.slice(offset, offset + pageSize);
}

export async function getArticleById(id) {
  const article = await db.articles.get(Number.parseInt(id, 10));
  if (!article) return null;
  const feed = await db.feeds.get(article.feedId);
  return { ...article, feed };
}

export async function searchArticles(
  keyword,
  showHiddenFeeds = false,
  sortField = "published_at",
) {
  try {
    const feeds = await db.feeds.toArray();
    const visibleFeedIds = feeds
      .filter((feed) => showHiddenFeeds || !feed.hide_globally)
      .map((feed) => feed.id);
    const articles = await db.articles
      .where("feedId")
      .anyOf(visibleFeedIds)
      .filter(
        (article) =>
          article.title &&
          article.title.toLowerCase().includes(keyword.toLowerCase()),
      )
      .sortBy(sortField);
    return articles.reverse();
  } catch (error) {
    throw reportError(error, "articles.search");
  }
}
