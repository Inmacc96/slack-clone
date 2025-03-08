import dynamic from "next/dynamic";
import Hint from "./hint";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { formatFullTime, formatTime, formatTimeWithPeriod } from "@/helpers";

const RendererMessageText = dynamic(
  () => import("@/components/render-message-text"),
  { ssr: false }
);

type Reaction = Omit<Doc<"reactions">, "memberId"> & {
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
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="w-10 shrink-0 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-[22px] text-center hover:underline">
              {formatTime(new Date(createdAt))}
            </button>
          </Hint>
          <div className="flex flex-col w-full">
            <RendererMessageText value={body} />
            {image ? <Thumbnail url={image} /> : null}
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
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
        </div>
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};

export default Message;
