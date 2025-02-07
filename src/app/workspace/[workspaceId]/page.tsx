"use client";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId();
  return <div>ID: {workspaceId}</div>;
};

export default WorkspacePage;
