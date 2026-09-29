export function resolveReducedMotion(userPreference, systemPreference) {
  return Boolean(userPreference || systemPreference);
}
