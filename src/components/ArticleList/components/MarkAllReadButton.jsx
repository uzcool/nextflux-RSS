import { useParams } from "react-router-dom";
import { Button, Dropdown, Label, Spinner } from "@heroui/react";
import { handleMarkAllRead } from "@/handlers/articleHandlers";
import { CircleCheck } from "lucide-react";
import { isSyncing } from "@/stores/syncStore.js";
import { useStore } from "@nanostores/react";
import { filter, markingAllAsRead } from "@/stores/articlesStore.js";
import { useTranslation } from "react-i18next";

export default function MarkAllReadButton() {
  const { t } = useTranslation();
  const { feedId, categoryId } = useParams();
  const $isSyncing = useStore(isSyncing);
  const $markingAllAsRead = useStore(markingAllAsRead);
  const $filter = useStore(filter);
  const isPending = $isSyncing || $markingAllAsRead;
  return (
    <Dropdown>
      <Button
        size="sm"
        radius="full"
        variant="ghost"
        isIconOnly
        isDisabled={$filter === "starred" || $markingAllAsRead}
        isPending={isPending}
      >
        {isPending ? (
          <Spinner color="current" size="sm" />
        ) : (
          <CircleCheck className="size-4 text-muted" />
        )}
      </Button>

      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label="markAllAsRead"
          onAction={(key) => {
            if (key !== "markAsRead") return;
            if (feedId) {
              handleMarkAllRead("feed", feedId);
            } else if (categoryId) {
              handleMarkAllRead("category", categoryId);
            } else {
              handleMarkAllRead();
            }
          }}
        >
          <Dropdown.Item
            id="markAsRead"
            textValue={t("articleList.markAllRead")}
            variant="danger"
          >
            <CircleCheck className="size-4 text-danger" />
            <Label className="text-danger">
              {t("articleList.markAllRead")}
            </Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
