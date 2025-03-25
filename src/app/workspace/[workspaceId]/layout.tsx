import { cookies } from "next/headers";
import WorkspaceClientLayout from "./client-layout";

interface WorkspaceLayout {
  children: React.ReactNode;
}

const WorkspaceLayout: React.FC<WorkspaceLayout> = async ({ children }) => {
  const cookiesInstance = await cookies();
  const layout = cookiesInstance.get("react-resizable-panels:layout");

  let defaultLayout;
  if (layout) {
    defaultLayout = JSON.parse(layout.value);
  }

  return (
    <WorkspaceClientLayout defaultLayout={defaultLayout}>
      {children}
    </WorkspaceClientLayout>
  );
};

export default WorkspaceLayout;
