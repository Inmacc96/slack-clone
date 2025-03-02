import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ placeholder }) => {
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<{ clearEditor: () => void } | null>(null);
  const editorQuillRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      await createMessage(
        { body, workspaceId, channelId },
        {
          throwError: true,
        }
      );
      editorRef.current?.clearEditor();
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        editorQuillRef={editorQuillRef}
      />
    </div>
  );
};

export default ChatInput;
