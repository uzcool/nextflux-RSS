import { atom, computed } from "nanostores";

export const unreadCounts = atom({});
export const starredCounts = atom({});

export const totalUnreadCount = computed([unreadCounts], ($unreadCounts) =>
  Object.values($unreadCounts).reduce((sum, count) => sum + count, 0),
);

export const totalStarredCount = computed([starredCounts], ($starredCounts) =>
  Object.values($starredCounts).reduce((sum, count) => sum + count, 0),
);
