"use client";
import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspace";
import { useEffect, useMemo } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to workspace");
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [workspaceId, isLoading, isOpen, setIsOpen]);

  return <UserButton />;
}
