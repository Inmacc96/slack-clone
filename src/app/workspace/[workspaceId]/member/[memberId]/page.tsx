"use client";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  return <div>{memberId}</div>;
};

export default MemberIdPage;
