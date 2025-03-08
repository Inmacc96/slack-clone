import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { isEmptyMessageText } from "@/helpers";

interface RendererMessageTextProps {
  value: string;
}

const RendererMessageText: React.FC<RendererMessageTextProps> = ({ value }) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;

    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });
    quill.enable(false);

    const contents = JSON.parse(value);
    quill.setContents(contents);

    setIsEmpty(isEmptyMessageText(quill.getText()));

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return null;

  return (
    <div className="ql-snow">
      <div ref={rendererRef} className="ql-editor ql-renderer" />
    </div>
  );
};

export default RendererMessageText;
