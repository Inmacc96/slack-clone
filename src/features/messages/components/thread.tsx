import { useState } from "react";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { differenceInMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import Message from "@/components/message";
import ChatInput from "@/components/chat-input";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useInfitineScroll } from "@/hooks/use-infinite-scroll";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { TIME_THRESHOLD } from "@/constants";

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
  const { results, loadMore, status } = useGetMessages({
    channelId,
    parentMessageId: messageId,
    order: "asc",
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const loadMoreRef = useInfitineScroll(loadMore, canLoadMore);

  if (loadingMessage || loadingCurrentMember || status === "LoadingFirstPage") {
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
      <div className="h-12 flex justify-between items-center px-4 border-b shrink-0">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />{" "}
        </Button>
      </div>
      <div className="mt-2 overflow-y-scroll messages-scrollbar">
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
          showFullTime
        />
        {message.thread.count > 0 && (
          <div className="flex items-center px-4 gap-4 my-2">
            <p className="text-muted-foreground text-sm">
              {message.thread.count}{" "}
              {message.thread.count === 1 ? "reply" : "replies"}
            </p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>
        )}
        {results.map((message, index) => {
          const prevMessage = results[index - 1];
          const isCompact =
            prevMessage &&
            prevMessage.user._id === message.user._id &&
            differenceInMinutes(
              new Date(message._creationTime),
              new Date(prevMessage._creationTime)
            ) < TIME_THRESHOLD;
          return (
            <Message
              key={message._id}
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
              isCompact={isCompact}
              hideThreadButton
              showFullTime
            />
          );
        })}
        <div ref={loadMoreRef} className="h-1" />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-2 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <div className="px-4 mt-2">
          <ChatInput
            channelId={channelId}
            parentMessageId={messageId}
            placeholder="Reply..."
          />
        </div>
      </div>
    </div>
  );
};

export default Thread;
