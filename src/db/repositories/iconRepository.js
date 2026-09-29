import { db } from "@/db/database.js";

export const getFeedIcon = (feedId) => db.feedIcons.get(feedId);
export const deleteFeedIcon = (feedId) => db.feedIcons.delete(feedId);
export const setFeedIcon = (feedIcon) =>
  db.feedIcons.put({ ...feedIcon, updated_at: new Date().toISOString() });
