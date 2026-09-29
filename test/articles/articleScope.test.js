import test from "node:test";
import assert from "node:assert/strict";

import {
  getAffectedFeedIds,
  getArticleFeedIds,
} from "../../src/domain/articles/articleScope.js";

const feeds = [
  { id: 1, categoryId: 10, hide_globally: false },
  { id: 2, categoryId: 10, hide_globally: true },
  { id: 3, categoryId: 20, hide_globally: false },
];

test("global scope excludes hidden feeds by default", () => {
  assert.deepEqual(getAffectedFeedIds(feeds), [1, 3]);
});

test("global scope includes hidden feeds when they are visible", () => {
  assert.deepEqual(
    getAffectedFeedIds(feeds, { showHiddenFeeds: true }),
    [1, 2, 3],
  );
});

test("category scope applies category and visibility filters", () => {
  assert.deepEqual(
    getAffectedFeedIds(feeds, { type: "category", id: "10" }),
    [1],
  );
});

test("an explicit feed scope targets only that feed", () => {
  assert.deepEqual(getAffectedFeedIds(feeds, { type: "feed", id: "2" }), [2]);
});

test("invalid scoped identifiers do not produce API targets", () => {
  assert.deepEqual(
    getAffectedFeedIds(feeds, { type: "feed", id: undefined }),
    [],
  );
  assert.deepEqual(
    getAffectedFeedIds(feeds, { type: "category", id: "invalid" }),
    [],
  );
});

test("article queries apply visibility to explicit feeds", () => {
  assert.deepEqual(getArticleFeedIds(feeds, { type: "feed", id: "2" }), []);
  assert.deepEqual(
    getArticleFeedIds(feeds, {
      type: "feed",
      id: "2",
      showHiddenFeeds: true,
    }),
    [2],
  );
});
