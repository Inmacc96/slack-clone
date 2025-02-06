"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { DialogTitle } from "@radix-ui/react-dialog";

const CreateWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();

  const handleClose = () => {
    setIsOpen(false);
    // TODO: Clear form
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
