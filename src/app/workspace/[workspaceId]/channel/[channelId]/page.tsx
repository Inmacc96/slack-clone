"use client";
import { Loader, TriangleAlert } from "lucide-react";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import Header from "./header";
import ChatInput from "./chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading) {
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
      <div className="flex-1"></div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
