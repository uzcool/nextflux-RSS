import { useIsMobile } from "@/hooks/use-mobile.jsx";
import { Drawer, Modal, cn } from "@heroui/react";

export default function CustomModal({
  open,
  onOpenChange,
  title,
  fixedHeight = false,
  children,
}) {
  const { isMedium } = useIsMobile();
  if (isMedium) {
    return (
      <Drawer>
        <Drawer.Backdrop isOpen={open} onOpenChange={onOpenChange}>
          <Drawer.Content>
            <Drawer.Dialog className={cn("px-0 pb-0", fixedHeight && "h-4/5")}>
              <Drawer.Handle />
              <Drawer.CloseTrigger />
              <Drawer.Header className="p-3">
                <Drawer.Heading>{title}</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>{children}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    );
  }
  return (
    <Modal>
      <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog className={cn("p-0", fixedHeight && "h-2/3")}>
            <Modal.Header>
              <Modal.Heading className="p-3">{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="mt-0">{children}</Modal.Body>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
