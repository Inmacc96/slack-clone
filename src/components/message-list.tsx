import { useState } from "react";
import { Loader } from "lucide-react";
import { differenceInMinutes, format } from "date-fns";
import Message from "./message";
import ChannelHero from "./channel-hero";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useInfitineScroll } from "@/hooks/use-infinite-scroll";
import { Id } from "../../convex/_generated/dataModel";
import { formatDateLabel } from "@/helpers";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data?: GetMessagesReturnType;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}) => {
  const loadMoreRef = useInfitineScroll(loadMore, canLoadMore);

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-scroll messages-scrollbar">
      {data?.map((message, index) => {
        const prevMessage = data[index + 1];
        const isCompact =
          prevMessage &&
          prevMessage.user._id === message.user._id &&
          differenceInMinutes(
            new Date(message._creationTime),
            new Date(prevMessage._creationTime)
          ) < TIME_THRESHOLD;

        const currentDate = format(
          new Date(message._creationTime),
          "yyyy-MM-dd"
        );
        const prevDate = prevMessage
          ? format(new Date(prevMessage._creationTime), "yyyy-MM-dd")
          : null;

        return (
          <div key={message._id}>
            {currentDate !== prevDate && (
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-white px-4 py-2 rounded-full text-xs border border-gray-300 shadow-sm">
                  {formatDateLabel(currentDate)}
                </span>
              </div>
            )}
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
              hideThreadButton={variant === "thread"}
              threadTimestamp={message.thread.timestamp}
              threadImage={message.thread.image}
              threadCount={message.thread.count}
            />
          </div>
        );
      })}
      <div ref={loadMoreRef} className="h-1 shrink-0" />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-2 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
};

export default MessageList;
