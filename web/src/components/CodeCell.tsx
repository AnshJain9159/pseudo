import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { FaPlay } from "react-icons/fa";

type CodeCellProps = {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  language: string;
};

const CodeCell: React.FC<CodeCellProps> = ({ code, onChange, onRun, language }) => {
  const extensions = language === "python" ? [python()] : [cpp()];

  return (
    <div className="relative bg-[#1E1E1E] rounded-md shadow-lg border border-[#3C3C3C] p-4 mb-4">
      {/* Play Button (top-right corner) */}
      <button
        onClick={onRun}
        className="absolute top-2 right-2 p-2 bg-[#3C3C3C] hover:bg-[#4a5568] rounded-full"
        title="Run"
      >
        <FaPlay className="text-white" />
      </button>

      {/* CodeMirror Editor */}
      <CodeMirror
        value={code}
        height="200px"
        theme={oneDark}
        extensions={extensions}
        onChange={(value) => onChange(value)}
        className="border-none rounded-md overflow-hidden"
      />
    </div>
  );
};

export default CodeCell;
