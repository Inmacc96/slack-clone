"use client";
import { Loader, TriangleAlert } from "lucide-react";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import Header from "./header";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import MessageList from "@/components/message-list";
import ChatInput from "@/components/chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-1 h-full items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <div className="px-5 w-full">
        <ChatInput
          channelId={channelId}
          placeholder={`Message # ${channel.name}`}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
