import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { toast } from "sonner";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { Id } from "../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}

type CreateMessageValues = {
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
  body: string;
  image?: Id<"_storage">;
};

const ChatInput: React.FC<ChatInputProps> = ({
  placeholder,
  channelId,
  parentMessageId,
  conversationId,
}) => {
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<{ clearEditor: () => void } | null>(null);
  const editorQuillRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
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
      editorQuillRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        channelId,
        parentMessageId,
        conversationId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl(
          {},
          {
            throwError: true,
          }
        );
        if (!url) throw new Error("Url not found");

        const result = await fetch(url!, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });
      editorRef.current?.clearEditor();
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorQuillRef.current?.enable(true);
      editorQuillRef.current?.focus();
    }
  };

  return (
    <Editor
      placeholder={placeholder}
      onSubmit={handleSubmit}
      disabled={isPending}
      innerRef={editorRef}
      editorQuillRef={editorQuillRef}
    />
  );
};

export default ChatInput;
