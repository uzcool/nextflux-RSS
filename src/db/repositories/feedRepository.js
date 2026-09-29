import { db } from "@/db/database.js";

export const addFeeds = (feeds) => db.feeds.bulkPut(feeds);
export const getFeeds = () => db.feeds.toArray();
export const deleteAllFeeds = () => db.feeds.clear();
export const deleteFeed = (feedId) => db.feeds.delete(feedId);
