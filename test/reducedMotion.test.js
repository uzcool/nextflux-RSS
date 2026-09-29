import assert from "node:assert/strict";
import test from "node:test";
import { resolveReducedMotion } from "../src/domain/preferences/reducedMotion.js";

test("reduces motion when either the user or system requests it", () => {
  assert.equal(resolveReducedMotion(true, false), true);
  assert.equal(resolveReducedMotion(false, true), true);
  assert.equal(resolveReducedMotion(true, true), true);
});

test("keeps motion enabled when neither preference requests reduction", () => {
  assert.equal(resolveReducedMotion(false, false), false);
});
