"use client";
import React, { FC, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";

interface CodeEditorViewProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
}

const CodeEditorView: FC<CodeEditorViewProps> = ({
  value,
  onChange,
  label,
}) => {
  const [htmlContent, setHtmlContent] = useState(value);

  const handleCodeChange = (newCode: string) => {
    setHtmlContent(newCode); // Update the HTML preview
    onChange(newCode); // Call parent handler to update the main state
  };

  const size = useWindowSize();

  const windowWidth: any = size && size?.width;

  return (
    <div className="flex w-full space-x-4">
      <div
        className="flex-1"
        style={{
          width: windowWidth / 2.4,
        }}
      >
        <label className="block text-sm font-workSans font-medium text-black mb-2">
          {label}
        </label>
        <div className="border rounded-lg overflow-hidden">
          <CodeMirror
            value={value}
            height="300px"
            extensions={[html()]}
            onChange={(value) => handleCodeChange(value)}
          />
        </div>
      </div>

      <div
        className="flex-1 border rounded-lg overflow-hidden h-[325px]"
        style={{
          width: windowWidth / 2.4,
        }}
      >
        <label className="block text-sm font-workSans font-medium text-black mb-2">
          Preview
        </label>
        <div
          className="border p-4 h-full overflow-auto"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default CodeEditorView;
