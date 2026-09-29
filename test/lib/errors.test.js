import test from "node:test";
import assert from "node:assert/strict";

import { normalizeError } from "../../src/lib/errors.js";

test("preserves Error instances", () => {
  const error = new Error("boom");
  assert.equal(normalizeError(error), error);
});

test("normalizes API and string errors", () => {
  const apiError = normalizeError({
    response: { status: 503, data: { error_message: "Unavailable" } },
  });
  assert.equal(apiError.message, "Unavailable");
  assert.equal(apiError.status, 503);
  assert.equal(normalizeError("Failure").message, "Failure");
});
