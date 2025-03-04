import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { loadFeeds } from "@/stores/feedsStore.js";
import { isSyncing, lastSync } from "@/stores/syncStore.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Image, ScrollShadow } from "@heroui/react";
import { formatLastSync } from "@/lib/format";
import { settingsState } from "@/stores/settingsStore.js";
import ArticlesGroup from "@/components/FeedList/components/ArticlesGroup.jsx";
import FeedsGroup from "@/components/FeedList/components/FeedsGroup.jsx";
import SyncButton from "@/components/FeedList/components/SyncButton.jsx";
import ProfileButton from "@/components/FeedList/components/ProfileButton.jsx";
import logo from "@/assets/logo.png";
import { getLastSyncTime } from "@/db/storage.js";
import AddFeedButton from "@/components/FeedList/components/AddFeedButton.jsx";
import { useTranslation } from "react-i18next";

const FeedListSidebar = () => {
  const { t } = useTranslation();
  const $lastSync = useStore(lastSync);
  const $isSyncing = useStore(isSyncing);
  const { showHiddenFeeds } = useStore(settingsState);

  useEffect(() => {
    lastSync.set(getLastSyncTime());
  }, []);

  useEffect(() => {
    loadFeeds();
  }, [$lastSync, showHiddenFeeds]);

  return (
    <Sidebar variant="sidebar" className="sidebar">
      <SidebarHeader className="sidebar-header standalone:pt-safe-or-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-1">
              <Image src={logo} alt="logo" className="size-8" radius="none" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Nextflux</span>
                <span className="truncate text-xs text-default-400">
                  {$isSyncing ? t("common.syncing") : formatLastSync($lastSync)}
                </span>
              </div>
              <SyncButton />
              <AddFeedButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollShadow className="h-full" size={10}>
          <ArticlesGroup />
          <FeedsGroup />
        </ScrollShadow>
      </SidebarContent>
      <SidebarFooter>
        <ProfileButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default FeedListSidebar;
