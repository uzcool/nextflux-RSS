export function normalizeServerUrl(serverUrl) {
  return serverUrl.trim().replace(/\/+$/, "").replace(/\/v1$/i, "");
}
