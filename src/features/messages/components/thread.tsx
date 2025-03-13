import { useState } from "react";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Message from "@/components/message";
import ChatInput from "@/components/chat-input";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetMessage } from "../api/use-get-message";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const Thread: React.FC<ThreadProps> = ({ messageId, onClose }) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentMember, isLoading: loadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  if (loadingMessage || loadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-12 flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-12 flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col gap-2 items-center justify-center text-muted-foreground">
          <AlertTriangle className="size-5" />
          <span className="text-sm">No message found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-12 flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />{" "}
        </Button>
      </div>
      <div className="mt-2">
        <Message
          id={message._id}
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          reactions={message.reactions}
          body={message.body}
          image={message.image}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          isEditing={message._id === editingId}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
      <div className="px-4">
        <ChatInput
          channelId={channelId}
          parentMessageId={messageId}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};

export default Thread;
