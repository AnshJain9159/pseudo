"use client";
import React, { useState } from "react";
import { FaPlay, FaPlayCircle, FaCode, FaPenFancy } from "react-icons/fa";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define the types for code and markdown cells
type CodeCell = { type: "code"; code: string; output: string };
type MarkdownCell = { type: "markdown"; code: string; markdownRendered: boolean; headingLevel: string };

// Union type for both types of cells
type Cell = CodeCell | MarkdownCell;

// Define available languages for code cells
const languages = [
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
];

const headingLevels = [
  { value: "#", label: "H1" },
  { value: "##", label: "H2" },
  { value: "###", label: "H3" },
  { value: "####", label: "H4" },
  { value: "#####", label: "H5" },
  { value: "######", label: "H6" },
];

const NotebookPage = () => {
  // Initialize both code and markdown cells
  const [cells, setCells] = useState<Cell[]>([
    { type: "markdown", code: "", markdownRendered: false, headingLevel: "#" },
    { type: "code", code: "", output: "" },
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);

  const runCode = async (index: number, code: string) => {
    const response = await axios.post("/api/executeCode", { code, language: selectedLanguage });
    const newCells = [...cells];
    if (newCells[index].type === "code") {
      newCells[index].output = response.data.output;
      setCells(newCells);
    }
  };

  const runSelectedCell = (index: number) => {
    const cell = cells[index];
    if (cell.type === "code") {
      runCode(index, cell.code);
    } else if (cell.type === "markdown") {
      const newCells = [...cells];
      newCells[index] = {
        ...newCells[index],
        markdownRendered: true,
      };
      setCells(newCells);
    }
  };

  const runAllCells = async () => {
    const newCells = await Promise.all(
      cells.map(async (cell, index) => {
        if (cell.type === "code") {
          const response = await axios.post("/api/executeCode", {
            code: cell.code,
            language: selectedLanguage,
          });
          return { ...cell, output: response.data.output };
        } else {
          return { ...cell, markdownRendered: true };
        }
      })
    );
    setCells(newCells);
  };

  const addCell = (type: "code" | "markdown") => {
    const newCell = type === "code"
      ? { type: "code", code: "", output: "" }
      : { type: "markdown", code: "", markdownRendered: false, headingLevel: "#" };

    const newCells = [...cells];
    const insertionIndex = selectedCellIndex !== null ? selectedCellIndex + 1 : cells.length;

    newCells.splice(insertionIndex, 0, newCell); // Insert the new cell just after the selected one
    setCells(newCells);
    setSelectedCellIndex(insertionIndex); // Automatically select the newly added cell
  };

  const getExtensions = () => {
    switch (selectedLanguage) {
      case "python":
        return [python()];
      case "c":
      case "cpp":
        return [cpp()];
      default:
        return [];
    }
  };

  const handleHeadingChange = (index: number, headingLevel: string) => {
    const newCells = [...cells];
    const cell = newCells[index];

    if (cell.type === "markdown") {
      const currentCode = cell.code;
      const newCode = currentCode.match(/^(#{1,6})\s/)
        ? currentCode.replace(/^(#{1,6})\s*/, headingLevel + " ")
        : `${headingLevel} ${currentCode}`;
      newCells[index] = { ...cell, headingLevel, code: newCode };
      setCells(newCells);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] py-12 px-4 sm:px-6 lg:px-8 text-[#c7c7c7]">
      <div className="max-w-4xl mx-auto">
        {/* Sticky Navbar with Run options */}
        <nav className="bg-[#2e2f33] text-[#c7c7c7] p-4 rounded-md flex justify-between items-center mb-8 sticky top-0 z-50 shadow-lg">
          <div className="flex space-x-4">
            {/* Run All Cells */}
            <button
              onClick={runAllCells}
              className="px-4 py-2 bg-[#2b6cb0] rounded hover:bg-[#2c5282]"
              title="Run All Cells"
            >
              <FaPlay />
            </button>
            {/* Run Selected Cell */}
            <button
              onClick={() => selectedCellIndex !== null && runSelectedCell(selectedCellIndex!)}
              className="px-4 py-2 bg-[#3182ce] rounded hover:bg-[#2c5282]"
              title="Run Selected Cell"
              disabled={selectedCellIndex === null}
            >
              <FaPlayCircle />
            </button>
          </div>
          <div className="flex space-x-4 items-center">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#2f3439] border border-[#4a5568] p-2 rounded"
              title="Select Language"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            {/* Add New Code Cell */}
            <button
              onClick={() => addCell("code")}
              className="px-4 py-2 bg-[#2f3439] rounded hover:bg-[#1f2933]"
              title="Add Code Cell"
            >
              <FaCode />
            </button>
            {/* Add New Markdown Cell */}
            <button
              onClick={() => addCell("markdown")}
              className="px-4 py-2 bg-[#d69e2e] rounded hover:bg-[#b7791f]"
              title="Add Markdown Cell"
            >
              <FaPenFancy />
            </button>
          </div>
        </nav>

        {/* Cells */}
        {cells.map((cell, index) => (
          <div
            key={index}
            className={`bg-[#2e2f33] shadow-md rounded-lg mb-8 overflow-hidden ${
              index === selectedCellIndex ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setSelectedCellIndex(index)}
          >
            <div className="p-4">
              {cell.type === "code" ? (
                <>
                  <CodeMirror
                    value={cell.code}
                    height="200px"
                    theme={oneDark}
                    extensions={getExtensions()}
                    onChange={(value: string) => {
                      const newCells = [...cells];
                      if (newCells[index].type === "code") {
                        newCells[index].code = value;
                        setCells(newCells);
                      }
                    }}
                    className="border border-[#4a5568] rounded-md overflow-hidden mt-4"
                  />

                  {/* Only display output for code cells */}
                  {cell.output && (
                    <pre className="mt-4 p-4 bg-[#1a1b1e] text-[#e2e8f0] rounded-md overflow-x-auto">
                      {cell.output}
                    </pre>
                  )}
                </>
              ) : !cell.markdownRendered ? (
                <>
                  {/* Markdown heading level selection */}
                  <select
                    title="Heading Level"
                    value={cell.headingLevel}
                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                    className="w-auto px-3 py-2 border border-[#4a5568] rounded-md bg-[#2f3439]"
                  >
                    {headingLevels.map((heading) => (
                      <option key={heading.value} value={heading.value}>
                        {heading.label}
                      </option>
                    ))}
                  </select>

                  {/* Markdown content input */}
                  <textarea
                    className="w-full h-48 p-4 text-[#c7c7c7] bg-[#1a1b1e] border border-[#4a5568] rounded-md mt-2"
                    placeholder="Write your markdown here..."
                    value={cell.code}
                    onChange={(e) => {
                      const newCells = [...cells];
                      newCells[index].code = e.target.value;
                      setCells(newCells);
                    }}
                  />
                </>
              ) : (
                <div className="prose prose-lg prose-invert bg-[#2e2f33] p-4 rounded-md text-[#e2e8f0]">
                  {/* Rendering the markdown using ReactMarkdown */}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{cell.code}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotebookPage;
