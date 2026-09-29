const LAST_SYNC_KEY = "lastSyncTime";

export function setLastSyncTime(time) {
  localStorage.setItem(LAST_SYNC_KEY, time.toISOString());
}

export function getLastSyncTime() {
  const time = localStorage.getItem(LAST_SYNC_KEY);
  return time ? new Date(time) : null;
}
