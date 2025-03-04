import { useStore } from "@nanostores/react";
import { getCategoryCount, getFeedCount } from "@/stores/feedsStore.js";
import { cn } from "@/lib/utils";
import { ChevronRight, TriangleAlert } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import { Link, useParams } from "react-router-dom";
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import FeedIcon from "@/components/ui/FeedIcon";
import { settingsState } from "@/stores/settingsStore";
import { useEffect, useState } from "react";

const FeedsGroupContent = ({ category }) => {
  const $getCategoryCount = useStore(getCategoryCount);
  const $getFeedCount = useStore(getFeedCount);
  const { isMobile, setOpenMobile } = useSidebar();
  const { categoryId, feedId } = useParams();
  const { defaultExpandCategory } = useStore(settingsState);

  // 从本地存储获取展开状态
  const getStoredExpandState = () => {
    const stored = localStorage.getItem("categoryExpanded");
    return stored ? JSON.parse(stored) : {};
  };

  // 初始状态从本地存储获取,如果没有则使用默认值
  const [open, setOpen] = useState(() => {
    const stored = getStoredExpandState();
    return stored[category.id] ?? defaultExpandCategory;
  });

  // 保存展开状态到本地存储
  const updateExpandState = (isOpen) => {
    const stored = getStoredExpandState();
    stored[category.id] = isOpen;
    localStorage.setItem("categoryExpanded", JSON.stringify(stored));
    setOpen(isOpen);
  };

  useEffect(() => {
    if (feedId) {
      const shouldExpand = category.feeds.some(
        (feed) => parseInt(feedId) === feed.id,
      );
      // 只在需要展开时更新状态
      if (shouldExpand) {
        updateExpandState(true);
      }
      // 滚动到活动的 feed
      if (shouldExpand) {
        const feedItem = document.querySelector(".active-feed");
        feedItem?.scrollIntoView({ behavior: "instant", block: "nearest" });
      }
    }
  }, [feedId, category.id]);

  return (
    <Collapsible key={category.id} open={open} onOpenChange={updateExpandState}>
      <SidebarMenuItem key={`menu-${category.id}`}>
          <SidebarMenuButton
            className={cn(
              categoryId === category.id && "bg-default rounded-md",
            )}
            asChild
          >
            <Link
              to={`/category/${category.id}`}
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <span className={"pl-6 font-medium"}>{category.title}</span>
            </Link>
          </SidebarMenuButton>

          <CollapsibleTrigger asChild>
            <SidebarMenuAction className="left-2 hover:bg-default text-default-500 data-[state=open]:rotate-90">
              <ChevronRight />
            </SidebarMenuAction>
          </CollapsibleTrigger>
          <SidebarMenuBadge className="justify-end">
            {$getCategoryCount(category.id) !== 0 &&
              $getCategoryCount(category.id)}
          </SidebarMenuBadge>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 px-0 border-none">
            {category.feeds.map((feed) => (
                <SidebarMenuSubItem key={feed.id}>
                  <SidebarMenuSubButton
                    asChild
                    className={cn(
                      "pl-8 pr-2 h-8",
                      parseInt(feedId) === feed.id &&
                        "active-feed bg-default rounded-md",
                    )}
                  >
                    <Link
                      to={`/feed/${feed.id}`}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <FeedIcon feedId={feed.id} />
                      <span className="flex-1 flex items-center gap-1">
                        {feed.parsing_error_count > 0 && (
                          <span className="text-warning">
                            <TriangleAlert className="size-4" />
                          </span>
                        )}
                        <span className="line-clamp-1">{feed.title}</span>
                      </span>
                      <span className="text-default-400 text-xs">
                        {$getFeedCount(feed.id) !== 0 && $getFeedCount(feed.id)}
                      </span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default FeedsGroupContent;
