import React, { useState, useEffect } from "react";
import { FaFileCode, FaPlay, FaRegFileAlt, FaRegEdit } from "react-icons/fa";
import { AiOutlinePlayCircle } from "react-icons/ai";
import axios from "axios";
import AceEditor from "react-ace";
import ReactMarkdown from "react-markdown";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-tomorrow";

type Cell = {
  id: number;
  type: "code" | "markdown";
  content: string;
  output: string;
  showMarkdownOutput: boolean;
};

const languages = [
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "markdown", label: "Markdown" },
];

const addCustomStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .ace_editor_custom {
      background: black !important;
    }
    .ace_editor_custom .ace_gutter {
      background: black !important;
    }
    .ace_editor_custom .ace_content {
      background: black !important;
    }
    .ace_editor_custom .ace_active-line {
      background: white !important;
    }
    .ace_editor_custom .ace_gutter-active-line {
      background: white !important;
    }
    .ace_editor {
      border-radius: 4px;
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);
};

const CustomCodeEditor: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [cellId, setCellId] = useState<number>(0);
  const [language, setLanguage] = useState<string>("python");

  const addCell = (type: "code" | "markdown", afterId: number | null = null) => {
    const newCell = { 
      id: cellId, 
      type, 
      content: "", 
      output: "", 
      showMarkdownOutput: false 
    };
    let newCells = [...cells];

    if (afterId !== null) {
      const index = newCells.findIndex((cell) => cell.id === afterId);
      newCells.splice(index + 1, 0, newCell);
    } else {
      newCells = [...newCells, newCell];
    }

    setCells(newCells);
    setCellId(cellId + 1);
  };

  const updateCellContent = (id: number, content: string) => {
    setCells(cells.map((cell) => (cell.id === id ? { ...cell, content } : cell)));
  };

  const toggleMarkdownView = (id: number) => {
    setCells(cells.map((cell) => 
      cell.id === id 
        ? { ...cell, showMarkdownOutput: !cell.showMarkdownOutput, output: cell.content } 
        : cell
    ));
  };

  const runCell = async (id: number) => {
    const cellToRun = cells.find((cell) => cell.id === id);
    if (cellToRun) {
      if (cellToRun.type === "code") {
        try {
          const response = await axios.post("/api/executeCode", {
            code: cellToRun.content,
            language,
          });
  
          const output = response.data.output || "No output";
          setCells(cells.map((cell) => (cell.id === id ? { ...cell, output } : cell)));
        } catch (error) {
          setCells(cells.map((cell) => (cell.id === id ? { ...cell, output: "Error running code" } : cell)));
        }
      } else if (cellToRun.type === "markdown") {
        toggleMarkdownView(id);
      }
    }
  };

  useEffect(() => {
    addCell("code");
    addCustomStyles();
  }, []);

  const renderCell = (cell: Cell) => {
    const editorProps = {
      editorProps: { $blockScrolling: true },
      fontSize: 16,
      width: "100%", // Full width for editor
      setOptions: {
        showLineNumbers: false,
        highlightActiveLine: true,
        tabSize: 4,
        showGutter: false,
        showPrintMargin: false,
      },
      className: "ace_editor_custom",
      wrapEnabled: true,
      style: {
        background: 'black',
        margin: 0,
        padding: 0,
      }
    };

    if (cell.type === "code") {
      return (
        <div className="relative bg-[#191919] px-3 py-2 rounded-md w-full">
          {/* Custom styled Run button above the editor */}
          <button
            onClick={() => runCell(cell.id)}
            className="absolute top-2 right-4 text-white px-3 py-1 rounded hover:bg-[#4a4a50] flex items-center space-x-1"
          >
            {cell.showMarkdownOutput ? (
              <FaRegEdit className="text-sm" /> // Pencil icon for "Edit"
            ) : (
              <FaPlay className="text-sm" />  // Play icon for "Preview"
            )}
          </button>

          <div className="w-full overflow-hidden bg-black rounded-md mt-8"> {/* Add margin for space between button and editor */}
            <AceEditor
              {...editorProps}
              mode={language === "python" ? "python" : "c_cpp"}
              theme="tomorrow"
              onChange={(value) => updateCellContent(cell.id, value)}
              value={cell.content}
              name={`code-editor-${cell.id}`}
              height="400px"
            />
          </div>

          {cell.output && (
            <div className="bg-black text-white p-4 mt-2 rounded">
              <h3 className="text-md mb-1"></h3>
              <pre>{cell.output}</pre>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="relative bg-[#2b2b2b] p-4 rounded-md w-full">
          {/* Custom styled Run button above the editor */}
          <button
            onClick={() => runCell(cell.id)}
            className="absolute top-2 right-4 bg-transparent text-white px-3 py-1 rounded hover:bg-[#4a4a50] flex items-center space-x-1"
          >
            {cell.showMarkdownOutput ? (
              <FaRegEdit className="text-sm" /> // Pencil icon for "Edit"
            ) : (
              <FaPlay className="text-sm" />  // Play icon for "Preview"
            )}
          </button>
          {!cell.showMarkdownOutput ? (
            <div className="w-full overflow-hidden text-white bg-black rounded-md mt-8"> {/* Add margin for space between button and editor */}
              <AceEditor
                {...editorProps}
                mode="markdown"
                theme="tomorrow"
                onChange={(value) => updateCellContent(cell.id, value)}
                value={cell.content}
                name={`markdown-editor-${cell.id}`}
                height="300px"
              />
            </div>
          ) : (
            <div className="bg-black text-white p-4 mt-2 rounded w-full prose prose-invert max-w-none">
              <ReactMarkdown>{cell.content}</ReactMarkdown>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 flex flex-col">
      <div className="w-full bg-black p-6 rounded-md shadow-lg flex-grow flex flex-col">
        <nav className="flex justify-center items-center bg-black p-4 rounded-md mb-4">
          <div>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#191919] text-white w-24 text-center p-2 rounded"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </nav>

        <div className="max-h-[800px] overflow-y-auto bg-black flex-grow">
          {cells.map((cell) => (
            <div key={cell.id} className="mb-4 w-full">
              {renderCell(cell)}

              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() => addCell("code", cell.id)}
                  className="flex items-center space-x-1 bg-[#323236] text-white px-2 py-1 rounded-md hover:bg-[#4a4a50] text-sm"
                >
                  <FaFileCode />
                  <span>+ Code</span>
                </button>
                <button
                  onClick={() => addCell("markdown", cell.id)}
                  className="flex items-center space-x-1 bg-[#323236] text-white px-2 py-1 rounded-md hover:bg-[#4a4a50] text-sm"
                >
                  <FaRegFileAlt />
                  <span>+ Markdown</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomCodeEditor;
