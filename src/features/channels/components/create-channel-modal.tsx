import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";

const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setIsOpen(false);
    setName("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.replace(/\s+/g, "-").toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess: (id) => {
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={handleChange}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
