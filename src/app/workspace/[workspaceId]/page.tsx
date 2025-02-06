interface WorkspacePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspacePage: React.FC<WorkspacePageProps> = async ({ params }) => {
  const workspaceId = (await params).workspaceId;
  return <div>ID: {workspaceId}</div>;
};

export default WorkspacePage;
