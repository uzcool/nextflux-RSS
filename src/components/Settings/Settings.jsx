import { cn, Button, Drawer, Tabs } from "@heroui/react";
import { useState } from "react";
import { settingsModalOpen } from "@/stores/modalStore.js";
import { useStore } from "@nanostores/react";
import General from "@/components/Settings/General.jsx";
import Appearance from "@/components/Settings/Appearance.jsx";
import Readability from "@/components/Settings/Readability.jsx";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile.jsx";

export default function App() {
  const isOpen = useStore(settingsModalOpen);
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useTranslation();
  const { isMedium } = useIsMobile();
  return (
    <Drawer>
      <Button className="hidden" />
      <Drawer.Backdrop
        isOpen={isOpen}
        onOpenChange={(value) => {
          settingsModalOpen.set(value);
          setActiveTab("general");
        }}
      >
        <Drawer.Content placement={isMedium ? "bottom" : "right"}>
          <Drawer.Dialog className={cn("px-0 pb-0", isMedium && "h-4/5")}>
            {isMedium && <Drawer.Handle />}
            <Drawer.CloseTrigger />
            <Drawer.Header className="p-3">
              <Drawer.Heading className="flex flex-col gap-3">
                {!isMedium && <div className="h-2"></div>}
                <Tabs
                  className="w-full"
                  selectedKey={activeTab}
                  onSelectionChange={(key) => {
                    setActiveTab(key);
                    const modalBody = document.querySelector(".modal-body");
                    if (modalBody) {
                      modalBody.scrollTop = 0;
                    }
                  }}
                >
                  <Tabs.ListContainer>
                    <Tabs.List
                      aria-label="general"
                      className="bg-default-100/90 backdrop-blur-md shadow-custom-inner p-px gap-0 overflow-visible"
                    >
                      <Tabs.Tab id="general">
                        {t("settings.general.title")}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="appearance">
                        <Tabs.Separator />
                        {t("settings.appearance.title")}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="readability">
                        <Tabs.Separator />
                        {t("settings.readability.title")}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <div className="p-3 overflow-y-auto flex flex-col gap-4">
                {activeTab === "general" && <General />}
                {activeTab === "appearance" && <Appearance />}
                {activeTab === "readability" && <Readability />}
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
