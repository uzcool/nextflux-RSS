import { atom } from "nanostores";
import { getLastSyncTime } from "@/db/storage.js";
import { reportError } from "@/lib/errors.js";
import { syncService } from "@/services/syncService.js";
import { settingsState } from "@/stores/settingsStore.js";

export const isOnline = atom(navigator.onLine);
export const isSyncing = atom(false);
export const lastSync = atom(null);
export const error = atom(null);

let syncInterval = null;

if (typeof window !== "undefined") {
  window.addEventListener("online", () => isOnline.set(true));
  window.addEventListener("offline", () => isOnline.set(false));
  window.addEventListener("nextflux:logout", stopAutoSync);
}

export async function sync() {
  if (!isOnline.get() || isSyncing.get()) return;

  isSyncing.set(true);
  error.set(null);
  try {
    lastSync.set(await syncService.synchronize());
  } catch (syncError) {
    error.set(reportError(syncError, "sync.run"));
  } finally {
    isSyncing.set(false);
  }
}

async function performSync() {
  if (!isOnline.get() || isSyncing.get()) return;

  try {
    const lastSyncTime = getLastSyncTime();
    const interval = Number.parseInt(settingsState.get().syncInterval, 10);
    if (!interval) return;

    if (!lastSyncTime || Date.now() - lastSyncTime > interval * 60 * 1000) {
      await sync();
    }
  } catch (syncError) {
    error.set(reportError(syncError, "sync.auto"));
  }
}

function resetSyncInterval() {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = null;

  const interval = Number.parseInt(settingsState.get().syncInterval, 10);
  if (interval) {
    syncInterval = setInterval(performSync, interval * 60 * 1000);
  }
}

export function startAutoSync() {
  if (typeof window === "undefined") return;
  performSync();
  resetSyncInterval();
  window.addEventListener("beforeunload", stopAutoSync);
}

export function stopAutoSync() {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = null;
  window.removeEventListener("beforeunload", stopAutoSync);
}

export function forceSync() {
  return sync();
}
