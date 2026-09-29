import { useRef } from "react";
import { useStore } from "@nanostores/react";
import { Button, cn, Spinner, Tooltip } from "@heroui/react";
import { Circle, CircleDot, FileText, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Confetti from "@/components/ui/Confetti";
import {
  handleMarkStatus,
  handleToggleContent,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import { loadingOriginContent } from "@/stores/articlesStore.js";
import ArticleAiAction from "./ArticleAiAction.jsx";
import ArticleExternalActions from "./ArticleExternalActions.jsx";

export default function ArticleStateActions({ article }) {
  const { t } = useTranslation();
  const starButtonRef = useRef(null);
  const fetchLoading = useStore(loadingOriginContent);

  return (
    <div className="flex gap-1 ml-auto">
      <Tooltip delay={0}>
        <Button
          onPress={() => handleMarkStatus(article)}
          variant="ghost"
          isIconOnly
          size="sm"
        >
          {article?.status === "unread" ? (
            <CircleDot className="size-4 text-muted p-0.5 fill-current" />
          ) : (
            <Circle className="size-4 text-muted p-0.5" />
          )}
        </Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          {article?.status === "read" ? t("common.unread") : t("common.read")}
        </Tooltip.Content>
      </Tooltip>
      <Tooltip delay={0}>
        <Button
          ref={starButtonRef}
          variant="ghost"
          isIconOnly
          size="sm"
          onPress={() => {
            if (article?.starred === 0) Confetti(starButtonRef);
            handleToggleStar(article);
          }}
        >
          <Star
            className={`size-4 text-muted ${article?.starred === 1 ? "fill-current" : ""}`}
          />
        </Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          {article?.starred === 1 ? t("common.unstar") : t("common.star")}
        </Tooltip.Content>
      </Tooltip>
      <ArticleExternalActions article={article} />
      <ArticleAiAction article={article} />
      <Tooltip delay={0}>
        <Button
          onPress={() => handleToggleContent(article)}
          variant="ghost"
          isIconOnly
          size="sm"
          isPending={fetchLoading}
        >
          {fetchLoading ? (
            <Spinner color="current" size="sm" />
          ) : (
            <FileText
              className={cn(
                "size-4",
                article?.shownOriginal ? "text-accent" : "text-muted",
              )}
            />
          )}
        </Button>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          {article?.shownOriginal
            ? t("articleView.showSummary")
            : t("articleView.getFullText")}
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
