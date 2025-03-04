import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  filter,
  filteredArticles,
  loadArticles,
  hasMore,
  currentPage,
  loading,
} from "@/stores/articlesStore.js";
import { lastSync } from "@/stores/syncStore.js";
import { useParams } from "react-router-dom";
import ArticleListHeader from "./components/ArticleListHeader";
import ArticleListContent from "./components/ArticleListContent";
import ArticleListFooter from "./components/ArticleListFooter";
import { settingsState } from "@/stores/settingsStore.js";
import ArticleView from "@/components/ArticleView/ArticleView.jsx";

const ArticleList = () => {
  const { feedId, categoryId } = useParams();
  const $filteredArticles = useStore(filteredArticles);
  const $filter = useStore(filter);
  const $lastSync = useStore(lastSync);
  const { showUnreadByDefault, sortDirection, showHiddenFeeds } =
    useStore(settingsState);

  useEffect(() => {
    let ignore = false;
    const handleFetchArticles = async () => {
      filteredArticles.set([]);
      loading.set(true);
      try {
        const res = await loadArticles(
          feedId || categoryId,
          feedId ? "feed" : categoryId ? "category" : null,
        );

        if (ignore) {
          return;
        }

        filteredArticles.set(res.articles);
        hasMore.set(res.isMore);
        currentPage.set(1);
        loading.set(false);
      } catch {
        console.error("加载文章失败");
        loading.set(false);
      }
    };
    handleFetchArticles(ignore);

    return () => {
      ignore = true;
    };
  }, [feedId, categoryId, $filter, sortDirection, showHiddenFeeds, $lastSync]);

  // 组件挂载时设置默认过滤器
  useEffect(() => {
    if (!feedId && !categoryId && showUnreadByDefault) {
      filter.set("unread");
    }
  }, []);

  return (
    <div className="main-content flex bg-content2">
      <div className="w-full relative max-w-[100vw] md:w-[21rem] md:max-w-[30%] md:min-w-[18rem] h-[100dvh] bg-content2 flex flex-col">
        <ArticleListHeader />
        <ArticleListContent articles={$filteredArticles} />
        <ArticleListFooter />
      </div>
      <ArticleView />
    </div>
  );
};

export default ArticleList;
