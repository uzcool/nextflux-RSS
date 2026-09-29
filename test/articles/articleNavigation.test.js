import test from "node:test";
import assert from "node:assert/strict";

import {
  getAdjacentArticle,
  getArticleBasePath,
} from "../../src/domain/articles/articleNavigation.js";

const articles = [{ id: 1 }, { id: 2 }, { id: 3 }];

test("derives article list base paths", () => {
  assert.equal(getArticleBasePath("/feed/2/article/3"), "/feed/2");
  assert.equal(getArticleBasePath("/article/3"), "/");
});

test("finds adjacent articles without crossing list boundaries", () => {
  assert.equal(getAdjacentArticle(articles, 2, "previous").id, 1);
  assert.equal(getAdjacentArticle(articles, 2, "next").id, 3);
  assert.equal(getAdjacentArticle(articles, 1, "previous"), null);
  assert.equal(getAdjacentArticle(articles, 3, "next"), null);
});
