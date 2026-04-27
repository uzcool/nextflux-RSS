export function normalizeServerUrl(serverUrl) {
  return typeof serverUrl === "string"
    ? serverUrl
        .trim()
        .replace(/\/+$/, "")
        .replace(/\/v1$/, "")
        .replace(/\/+$/, "")
    : "";
}
