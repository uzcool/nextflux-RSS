import { apiClient } from "@/api/client.js";

export async function checkIntegrations() {
  const response = await apiClient.get("/v1/integrations/status");
  return response.data.has_integrations;
}

export async function saveToThirdParty(entryId) {
  await apiClient.post(`/v1/entries/${entryId}/save`);
}
