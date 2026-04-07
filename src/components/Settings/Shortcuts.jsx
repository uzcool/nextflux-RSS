import { ItemWrapper, KeyboardItem } from "@/components/ui/settingItem.jsx";
import { Separator } from "@heroui/react";
import { shortcutsModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import { Keyboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomModal from "@/components/ui/CustomModal.jsx";
export default function Shortcuts() {
  const { t } = useTranslation();
  const shortcuts = {
    article: [
      { key: "J", desc: t("sidebar.shortcuts.next") },
      { key: "K", desc: t("sidebar.shortcuts.previous") },
      { key: "M", desc: t("sidebar.shortcuts.toggleRead") },
      { key: "S", desc: t("sidebar.shortcuts.toggleStar") },
      { key: "G", desc: t("sidebar.shortcuts.toggleReaderView") },
      { key: "ESC", desc: t("sidebar.shortcuts.close") },
      { key: "V", desc: t("sidebar.shortcuts.viewInBrowser") },
    ],
    global: [
      {
        key: "?",
        desc: t("sidebar.shortcuts.toggleShortcuts"),
      },
      { key: "R", desc: t("sidebar.shortcuts.refresh") },
      {
        key: "F",
        desc: t("sidebar.shortcuts.search"),
      },
    ],
    sidebar: [
      {
        key: "B",
        desc: t("sidebar.shortcuts.toggleSidebar"),
        kbdKey: ["ctrl"],
      },
      {
        key: "N",
        desc: t("sidebar.shortcuts.addFeed"),
        kbdKey: ["shift"],
      },
      {
        key: "P",
        desc: t("sidebar.shortcuts.prevItem"),
      },
      {
        key: "N",
        desc: t("sidebar.shortcuts.nextItem"),
      },
      {
        key: "X",
        desc: t("sidebar.shortcuts.toggleCategory"),
      },
    ],
  };
  const isOpen = useStore(shortcutsModalOpen);

  return (
    <CustomModal
      open={isOpen}
      onOpenChange={(value) => {
        shortcutsModalOpen.set(value);
      }}
      title={
        <div className="flex items-center gap-2">
          <Keyboard className="size-4" />
          <span className="text-base font-medium">
            {t("sidebar.shortcuts.title")}
          </span>
        </div>
      }
      fixedHeight
    >
      <div className="p-3 overflow-y-auto flex flex-col gap-4">
        <ItemWrapper title={t("sidebar.shortcuts.global")}>
          {shortcuts.global.map((shortcut, index) => (
            <div key={shortcut.desc}>
              <KeyboardItem
                key={shortcut.desc}
                keyStr={shortcut.key}
                kbdKey={shortcut.kbdKey}
                desc={shortcut.desc}
              />
              {index !== shortcuts.global.length - 1 && <Separator />}
            </div>
          ))}
        </ItemWrapper>

        <ItemWrapper title={t("sidebar.shortcuts.sidebar")}>
          {shortcuts.sidebar.map((shortcut, index) => (
            <div key={shortcut.desc}>
              <KeyboardItem
                key={shortcut.desc}
                keyStr={shortcut.key}
                kbdKey={shortcut.kbdKey}
                desc={shortcut.desc}
              />
              {index !== shortcuts.sidebar.length - 1 && <Separator />}
            </div>
          ))}
        </ItemWrapper>

        <ItemWrapper title={t("sidebar.shortcuts.article")}>
          {shortcuts.article.map((shortcut, index) => (
            <div key={shortcut.desc}>
              <KeyboardItem
                key={shortcut.desc}
                keyStr={shortcut.key}
                desc={shortcut.desc}
              />
              {index !== shortcuts.article.length - 1 && <Separator />}
            </div>
          ))}
        </ItemWrapper>
      </div>
    </CustomModal>
  );
}
