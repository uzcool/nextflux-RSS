import { useStore } from "@nanostores/react";
import { Button, Spinner } from "@heroui/react";
import { forceSync, isOnline, isSyncing } from "@/stores/syncStore.js";
import { RefreshCw } from "lucide-react";
import { reportError } from "@/lib/errors.js";

const SyncButton = () => {
  const $isOnline = useStore(isOnline);
  const $isSyncing = useStore(isSyncing);

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (err) {
      reportError(err, "sync.force");
    }
  };

  return (
    <Button
      onPress={handleForceSync}
      isDisabled={$isSyncing || !$isOnline}
      isPending={$isSyncing}
      variant="ghost"
      isIconOnly
      size="sm"
    >
      {$isSyncing ? (
        <Spinner color="current" size="sm" />
      ) : (
        <RefreshCw className="size-4 text-muted" />
      )}
    </Button>
  );
};

export default SyncButton;
