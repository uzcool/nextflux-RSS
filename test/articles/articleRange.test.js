import test from "node:test";
import assert from "node:assert/strict";

import {
  countArticlesByFeed,
  getUnreadArticlesInRange,
} from "../../src/domain/articles/articleRange.js";

const articles = [
  { id: 1, feedId: 1, status: "unread" },
  { id: 2, feedId: 1, status: "read" },
  { id: 3, feedId: 2, status: "unread" },
  { id: 4, feedId: 2, status: "unread" },
];

test("selects unread articles above and including the target", () => {
  assert.deepEqual(
    getUnreadArticlesInRange(articles, 3, "above").map(({ id }) => id),
    [1, 3],
  );
});

test("selects unread articles below and including the target", () => {
  assert.deepEqual(
    getUnreadArticlesInRange(articles, 3, "below").map(({ id }) => id),
    [3, 4],
  );
});

test("does not select a range when the target is already the last article", () => {
  assert.deepEqual(getUnreadArticlesInRange(articles, 4, "below"), []);
});

test("counts selected articles per feed", () => {
  assert.deepEqual(countArticlesByFeed(articles), { 1: 2, 2: 2 });
});
