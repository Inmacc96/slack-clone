import { useRef } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ placeholder }) => {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
