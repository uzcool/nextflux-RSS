import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, CloseButton, Tooltip } from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function ArticleNavigationControls({
  canGoNext,
  canGoPrevious,
  onClose,
  onNext,
  onPrevious,
}) {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip classNames={{ content: "shadow-custom!" }}>
        <CloseButton onPress={onClose} className="mx-2" />
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          {t("common.close")}
        </Tooltip.Content>
      </Tooltip>
      <div className="gap-1 hidden md:flex">
        <Tooltip delay={0}>
          <Button
            onPress={onPrevious}
            isDisabled={!canGoPrevious}
            isIconOnly
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4 text-muted" />
          </Button>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            {t("common.previous")}
          </Tooltip.Content>
        </Tooltip>
        <Tooltip delay={0}>
          <Button
            onPress={onNext}
            isDisabled={!canGoNext}
            isIconOnly
            size="sm"
            variant="ghost"
          >
            <ArrowRight className="h-4 w-4 text-muted" />
          </Button>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            {t("common.next")}
          </Tooltip.Content>
        </Tooltip>
      </div>
    </>
  );
}
