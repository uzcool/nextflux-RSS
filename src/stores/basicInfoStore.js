import { atom } from "nanostores";
import minifluxAPI from "@/api/miniflux";
import { reportError } from "@/lib/errors.js";

export const hasIntegrations = atom(false);

// 检查第三方集成状态
export async function checkIntegrations() {
  try {
    const result = await minifluxAPI.checkIntegrations();
    hasIntegrations.set(result);
  } catch (error) {
    reportError(error, "integrations.check");
    hasIntegrations.set(false);
  }
}
