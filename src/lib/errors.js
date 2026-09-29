const reportedErrors = new WeakSet();

export function normalizeError(error, fallbackMessage = "操作失败") {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);

  const message =
    error?.response?.data?.error_message || error?.message || fallbackMessage;
  const normalized = new Error(message, { cause: error });
  normalized.status = error?.response?.status;
  return normalized;
}

export function reportError(error, context, fallbackMessage) {
  const normalized = normalizeError(error, fallbackMessage);
  if (!reportedErrors.has(normalized)) {
    console.error(`[${context}]`, normalized);
    reportedErrors.add(normalized);
  }
  return normalized;
}
