"use client"
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import axios from "axios";

const languages = [
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  // { value: "java", label: "Java" },
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
      // case "java":
        return [cpp()];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          🚀 Interactive Code Notebook 👨‍💻
        </h1>
        {cells.map((cell, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg mb-8 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <select
              title="language"
                value={cell.language}
                onChange={(e) => {
                  const newCells = [...cells];
                  newCells[index].language = e.target.value;
                  setCells(newCells);
                }}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-4">
              <CodeMirror
                value={cell.code}
                height="200px"
                theme={oneDark}
                extensions={getExtensions(cell.language)}
                onChange={(value: string) => {
                  const newCells = [...cells];
                  newCells[index].code = value;
                  setCells(newCells);
                }}
                className="border border-gray-300 rounded-md overflow-hidden"
              />
              <button
                onClick={() => runCode(index, cell.code, cell.language)}
                className="mt-4 w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Run Code
              </button>
              {cell.output && (
                <pre className="mt-4 p-4 bg-gray-800 text-white rounded-md overflow-x-auto">
                  {cell.output}
                </pre>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addCell}
          className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Cell
        </button>
      </div>
    </div>
  );
};

export default NotebookPage;