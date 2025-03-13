import dynamic from "next/dynamic";
import { toast } from "sonner";
import Hint from "./hint";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import Reactions from "./reactions";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { useConfirm } from "@/hooks/use-confirm";
import { usePanel } from "@/hooks/use-panel";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { formatFullTime, formatTime, formatTimeWithPeriod } from "@/helpers";
import { cn } from "@/lib/utils";

const RendererMessageText = dynamic(
  () => import("@/components/render-message-text"),
  { ssr: false }
);
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export type Reaction = Omit<Doc<"reactions">, "memberId"> & {
  count: number;
  memberIds: Id<"members">[];
};

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Reaction[];
  body: Doc<"messages">["body"];
  image?: string | null;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadImage?: string;
  threadCount?: number;
  threadTimestamp?: number;
}

const Message: React.FC<MessageProps> = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  updatedAt,
  createdAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadImage,
  threadCount,
  threadTimestamp,
}) => {
  const { parentMessageId, onOpenMessage, onClose } = usePanel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone."
  );
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending =
    isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="w-10 shrink-0 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-[22px] text-center hover:underline">
                {formatTime(new Date(createdAt))}
              </button>
            </Hint>
            {isEditing ? (
              <div className="size-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <RendererMessageText value={body} />
                {image ? <Thumbnail url={image} /> : null}
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="size-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline mr-2"
                >
                  {authorName}
                </button>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {formatTimeWithPeriod(new Date(createdAt))}
                  </button>
                </Hint>
              </div>
              <RendererMessageText value={body} />
              {image ? <Thumbnail url={image} /> : null}
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
