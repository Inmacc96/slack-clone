import { MdOutlineAddReaction } from "react-icons/md";
import Hint from "./hint";
import { Reaction } from "./message";
import EmojiPopover from "./emoji-popover";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

interface ReactionsProps {
  data: Reaction[];
  onChange: (value: string) => void;
}

const Reactions: React.FC<ReactionsProps> = ({ data, onChange }) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 my-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "bg-slate-200/70 border border-transparent  h-6 px-2 rounded-full flex gap-1 items-center",
              reaction.memberIds.includes(currentMemberId)
                ? "bg-blue-100/70 border-blue-500"
                : "hover:border-slate-500"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-6 px-2 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 hover:bg-white text-slate-800">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
