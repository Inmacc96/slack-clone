import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

const ConversationHero: React.FC<ConversationHeroProps> = ({
  name = "Member",
  image,
}) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4 p-4">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="size-14">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800">
        This converversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
