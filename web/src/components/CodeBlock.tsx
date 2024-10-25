import React, { useEffect } from "react";
import Prism from "prismjs"; // Import Prism.js

// Import necessary languages (Prism automatically handles basic languages like Python, C, and C++)
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

// Prism.js themes are already imported globally via CSS.

type CodeBlockProps = {
  code: string;
  language: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll(); // Re-highlight code when component mounts or updates
  }, [code]);

  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default CodeBlock;
