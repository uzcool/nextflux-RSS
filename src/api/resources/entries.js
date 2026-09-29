import { apiClient } from "@/api/client.js";

const toTimestamp = (date) => Math.floor(new Date(date).getTime() / 1000);

export async function getFeedEntries(feedId, params = {}) {
  const response = await apiClient.get(`/v1/feeds/${feedId}/entries`, {
    params: { direction: "desc", limit: 50, ...params },
  });
  return response.data.entries;
}

export async function updateEntryStatus(entry) {
  const status = entry.status === "read" ? "unread" : "read";
  await apiClient.put("/v1/entries", { entry_ids: [entry.id], status });
}

export async function updateEntryStarred(entry) {
  await apiClient.put(`/v1/entries/${entry.id}/bookmark`);
}

export async function getChangedEntries(lastSyncTime) {
  const response = await apiClient.get("/v1/entries", {
    params: {
      changed_after: toTimestamp(lastSyncTime),
      direction: "desc",
      limit: 0,
    },
  });
  return response.data.entries;
}

export async function getNewEntries(lastSyncTime) {
  const response = await apiClient.get("/v1/entries", {
    params: {
      after: toTimestamp(lastSyncTime),
      direction: "desc",
      limit: 0,
    },
  });
  return response.data.entries;
}

export async function getAllStarredEntries() {
  const response = await apiClient.get("/v1/entries", {
    params: { starred: true, status: "read", direction: "desc", limit: 0 },
  });
  return response.data.entries;
}

export async function fetchEntryContent(entryId) {
  const response = await apiClient.get(`/v1/entries/${entryId}/fetch-content`);
  return response.data.content;
}

export async function getUnreadEntriesByPage(offset = 0, limit = 100) {
  const response = await apiClient.get("/v1/entries", {
    params: { status: "unread", direction: "desc", offset, limit },
  });
  return response.data;
}
