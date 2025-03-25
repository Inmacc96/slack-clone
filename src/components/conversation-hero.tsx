import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useMemberId } from "@/hooks/use-member-id";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

const ConversationHero: React.FC<ConversationHeroProps> = ({
  name = "Member",
  image,
}) => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="size-14">
          <AvatarImage src={image} />
          <AvatarFallback className="text-3xl">{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800">
        {memberId === currentMember?._id ? (
          "Your private space for drafts, to-do lists, and quick access to links/images. You can chat with yourself—just handle both sides!"
        ) : (
          <>
            This conversation is just between you and <strong>{name}</strong>
          </>
        )}
      </p>
    </div>
  );
};

export default ConversationHero;
