import { Loader, TriangleAlert } from "lucide-react";
import Header from "./header";
import MessageList from "@/components/message-list";
import ChatInput from "@/components/chat-input";
import { useMemberId } from "@/hooks/use-member-id";
import { usePanel } from "@/hooks/use-panel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useGetMember } from "@/features/members/api/use-get-member";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation: React.FC<ConversationProps> = ({ id }) => {
  const memberId = useMemberId();
  const { onOpenProfile } = usePanel();

  const { results, status, loadMore } = useGetMessages({ conversationId: id });
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-1 h-full items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Member not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member.user.name}
        memberImage={member.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        variant="conversation"
        memberName={member.user.name}
        memberImage={member.user.image}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <div className="px-5 w-full">
        <ChatInput
          conversationId={id}
          placeholder={`Send a message to ${member.user.name}`}
        />
      </div>
    </div>
  );
};

export default Conversation;
