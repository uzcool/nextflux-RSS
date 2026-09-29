import minifluxApi from "@/api/miniflux.js";
import * as repository from "@/db/storage.js";
import { mapEntryToArticle } from "@/domain/articles/mapEntryToArticle.js";
import { createSyncService } from "@/services/syncServiceFactory.js";

export const syncService = createSyncService({
  api: minifluxApi,
  repository,
  mapEntry: mapEntryToArticle,
});
