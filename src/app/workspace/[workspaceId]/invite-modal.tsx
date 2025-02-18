import { toast } from "sonner";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModal: React.FC<InviteModalProps> = ({
  open,
  setOpen,
  name,
  joinCode,
}) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated");
        },
        onError: () => {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    window.navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link <CopyIcon className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              variant="outline"
              onClick={handleNewCode}
            >
              New code <RefreshCcw className="size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
};

export default InviteModal;
