"use client"
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python"; // For Python language mode
import { cpp } from "@codemirror/lang-cpp"; // For C, C++, Java
import { oneDark } from "@codemirror/theme-one-dark"; // Import the One Dark theme
import axios from "axios";

const languages = [
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const NotebookPage = () => {
  const [cells, setCells] = useState([{ code: "", output: "", language: "python" }]);

  const runCode = async (index: number, code: string, language: string) => {
    const response = await axios.post("/api/executeCode", { code, language });
    const newCells = [...cells];
    newCells[index].output = response.data.output;
    setCells(newCells);
  };

  const addCell = () => {
    setCells([...cells, { code: "", output: "", language: "python" }]);
  };

  const getExtensions = (language: string) => {
    switch (language) {
      case "python":
        return [python()];
      case "c":
      case "cpp":
      case "java":
        return [cpp()]; // C-like languages share the same extension
      default:
        return [];
    }
  };

  return (
    <div className="notebook-container">
      <h1 className="text-3xl font-bold mb-4 text-center">🚀 Notebook with Code Execution 👋</h1>
      {cells.map((cell, index) => (
        <div key={index} className="notebook-cell mb-6">
          <select
            value={cell.language}
            onChange={(e) => {
              const newCells = [...cells];
              newCells[index].language = e.target.value;
              setCells(newCells);
            }}
            className="mb-2 p-2 border rounded-md"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <CodeMirror
            value={cell.code}
            height="200px"
            theme={oneDark} // Use the One Dark theme
            extensions={getExtensions(cell.language)} // Set the correct language mode
            onChange={(value: string) => {
              const newCells = [...cells];
              newCells[index].code = value;
              setCells(newCells);
            }}
            className="border p-2 rounded-md"
          />
          <button
            onClick={() => runCode(index, cell.code, cell.language)}
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
          >
            Run
          </button>

          {cell.output && (
            <pre className="output-box bg-gray-100 p-2 mt-2 rounded-md">{cell.output}</pre>
          )}
        </div>
      ))}
      <button onClick={addCell} className="bg-green-500 text-white p-2 rounded-md">
        Add Cell
      </button>
    </div>
  );
};

export default NotebookPage;
