import test from "node:test";
import assert from "node:assert/strict";

import {
  getLastSyncTime,
  setLastSyncTime,
} from "../../src/db/repositories/syncMetadataRepository.js";

test("round-trips the last synchronization timestamp", () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };

  const timestamp = new Date("2026-09-29T12:00:00Z");
  setLastSyncTime(timestamp);
  assert.equal(getLastSyncTime().toISOString(), timestamp.toISOString());

  delete globalThis.localStorage;
});
