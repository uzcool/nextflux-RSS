import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { settingsState } from "@/stores/settingsStore.js";
import { resolveReducedMotion } from "@/domain/preferences/reducedMotion.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getSystemPreference() {
  return window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
}

export function useReducedMotion() {
  const { reduceMotion } = useStore(settingsState);
  const [systemPreference, setSystemPreference] = useState(getSystemPreference);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (!mediaQuery) return undefined;

    const handleChange = (event) => setSystemPreference(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return resolveReducedMotion(reduceMotion, systemPreference);
}

export function useApplyReducedMotionPreference() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduceMotion);
  }, [reduceMotion]);

  return reduceMotion;
}
