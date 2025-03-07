import { Doc, Id } from "../../convex/_generated/dataModel";

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
  return <div>{JSON.stringify(body)}</div>;
};

export default Message;
