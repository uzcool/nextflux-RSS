import { atom } from "nanostores";
import { debounce } from "lodash";
import { feeds } from "@/stores/feedsStore";
import { settingsState } from "@/stores/settingsStore";
import { searchArticles } from "@/db/storage";

export const searchResults = atom([]);
export const feedSearchResults = atom([]);
export const searching = atom(false);
export const searchError = atom(null);

// 执行本地文章搜索
export const debouncedSearch = debounce(
  async (query) => {
    if (!query.trim()) {
      searchResults.set([]);
      return;
    }

    try {
      searching.set(true);
      searchError.set(null);
      const articles = await searchArticles(query, settingsState.get().showHiddenFeeds);

      searchResults.set(articles);
    } catch (error) {
      searchError.set(error);
      console.error("搜索失败:", error);
    } finally {
      searching.set(false);
    }
  },
  500,
  { leading: true, trailing: false },
);

// 执行订阅源搜索
export async function searchFeeds(keyword) {
  if (!keyword) {
    feedSearchResults.set([]);
    return;
  }

  searching.set(true);
  try {
    const showHiddenFeeds = settingsState.get().showHiddenFeeds;
    const results = feeds.get().filter((feed) => {
      // 先检查feed是否应该显示
      if (!showHiddenFeeds && feed.hide_globally) {
        return false;
      }

      const searchText = [feed.title, feed.url]
        .join(" ")
        .toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    feedSearchResults.set(results);
  } catch (error) {
    console.error("搜索失败:", error);
  } finally {
    searching.set(false);
  }
}
