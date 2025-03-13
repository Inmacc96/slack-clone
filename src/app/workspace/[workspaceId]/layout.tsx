"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import WorkspaceSidebar from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ children }) => {
  const { parentMessageId } = usePanel();

  const showPanel = !!parentMessageId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)] bg-[#3b0c3f] pb-1 pr-1">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
          className="rounded-lg"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={12}
            className="bg-[#572758]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} className="bg-white">
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={30}
                minSize={20}
                className="bg-white"
              >
                Load thread
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
