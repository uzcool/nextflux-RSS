import { Button, Card, CardHeader, Image } from "@heroui/react";
import { activeAudio, audioState } from "@/stores/audioStore.js";
import { activeArticle } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils.js";
import cover from "@/assets/cover.jpg";
import { useEffect, useState } from "react";
import { plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr";

export default function PlayAndPause({ source, poster }) {
  const { paused, loading } = useStore(audioState);
  const $activeArticle = useStore(activeArticle);
  const $activeAudio = useStore(activeAudio);
  const [currentPlaying, setCurrentPlaying] = useState(false);
  const { Play, Pause } = plyrLayoutIcons;

  useEffect(() => {
    setCurrentPlaying(!paused && $activeAudio?.id === source.id);
  }, [paused, source, $activeAudio]);

  return (
    <Card
      className={cn(
        "playAndPause mx-auto my-16 w-60 aspect-square max-w-full bg-content2",
        currentPlaying ? "scale-[1.15]" : "",
      )}
    >
      <CardHeader className="absolute z-10 top-1 w-full h-full flex-col items-center justify-center">
        {!currentPlaying ? (
          <Button
            className="bg-white text-black/60 shadow-custom"
            radius="full"
            isLoading={currentPlaying && loading}
            isIconOnly
            onPress={() => {
              activeAudio.set(source);
              audioState.setKey("loading", true);
              audioState.setKey("title", $activeArticle.title);
              audioState.setKey("artist", $activeArticle.feed.title || "");
              audioState.setKey("paused", false);
              audioState.setKey("artwork", poster || "");
            }}
          >
            <Play className="size-4 fill-current ml-0.5" />
          </Button>
        ) : (
          <Button
            className="bg-white text-black/60 shadow-custom"
            radius="full"
            isLoading={loading}
            isIconOnly
            onPress={() => {
              audioState.setKey("paused", true);
            }}
          >
            <Pause className="size-4 fill-current" />
          </Button>
        )}
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src={poster || cover}
      />
    </Card>
  );
}
