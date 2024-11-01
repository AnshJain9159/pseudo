import React, { useState } from "react";
import { Play } from "lucide-react";
import axios from "axios";
import AceEditor from "react-ace";
import ReactMarkdown from "react-markdown";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night";

type Cell = {
  id: number;
  type: "code" | "markdown";
  content: string;
  output: string;
  showMarkdownOutput: boolean;
};

const CustomCodeEditor: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([{ id: 0, type: "code", content: "", output: "", showMarkdownOutput: false }]);
  const [language, setLanguage] = useState<string>("python");

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
        setCells(cells.map((cell) => 
          cell.id === id ? { ...cell, showMarkdownOutput: !cell.showMarkdownOutput } : cell
        ));
      }
    }
  };

  const addCell = (type: "code" | "markdown") => {
    const newCell = { 
      id: cells.length, 
      type, 
      content: "", 
      output: "", 
      showMarkdownOutput: false 
    };
    setCells([...cells, newCell]);
  };

  return (
    <div className="w-full bg-black text-white">
      <div className="px-4 py-2 border-b border-zinc-800">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-900 text-white px-3 py-1 rounded text-sm border border-zinc-800"
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
      </div>

      <div>
        {cells.map((cell) => (
          <div key={cell.id} className="border-b border-zinc-800">
            <div className="flex items-center justify-between px-4 py-1">
              <span className="text-xs text-zinc-500">
                {cell.type === "code" ? `In [${cell.id + 1}]:` : "Markdown"}
              </span>
              <button
                onClick={() => runCell(cell.id)}
                className="p-1 rounded hover:bg-zinc-800 text-blue-400"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-4">
              {cell.type === "markdown" ? (
                cell.showMarkdownOutput ? (
                  <div className="prose prose-invert max-w-none py-2 text-white">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="text-white">{children}</p>,
                        h1: ({ children }) => <h1 className="text-white">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-white">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-white">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-white">{children}</h4>,
                        h5: ({ children }) => <h5 className="text-white">{children}</h5>,
                        h6: ({ children }) => <h6 className="text-white">{children}</h6>,
                        li: ({ children }) => <li className="text-white">{children}</li>,
                        strong: ({ children }) => <strong className="text-white">{children}</strong>,
                        em: ({ children }) => <em className="text-white">{children}</em>,
                      }}
                    >
                      {cell.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    value={cell.content}
                    onChange={(e) => {
                      setCells(cells.map((c) => 
                        c.id === cell.id ? { ...c, content: e.target.value } : c
                      ));
                    }}
                    className="w-full bg-zinc-900 text-white p-2 rounded-md border border-zinc-800 focus:outline-none focus:border-blue-500 min-h-[100px] font-mono text-sm"
                    placeholder="Enter markdown..."
                  />
                )
              ) : (
                <AceEditor
                  mode={language === "python" ? "python" : "c_cpp"}
                  theme="tomorrow_night"
                  onChange={(value) => {
                    setCells(cells.map((c) => 
                      c.id === cell.id ? { ...c, content: value } : c
                    ));
                  }}
                  value={cell.content}
                  name={`editor-${cell.id}`}
                  width="100%"
                  height="100px"
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 4,
                  }}
                  className="bg-black"
                />
              )}
            </div>

            {cell.type === "code" && cell.output && (
              <div className="px-4 py-2 bg-black text-zinc-300">
                <span className="text-xs text-zinc-500">Out [{cell.id + 1}]:</span>
                <pre className="text-sm font-mono mt-1">{cell.output}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mx-4 my-2">
        <button
          onClick={() => addCell("code")}
          className="px-3 py-1 text-xs border border-zinc-800 rounded hover:bg-zinc-800 text-zinc-400"
        >
          + Code Cell
        </button>
        <button
          onClick={() => addCell("markdown")}
          className="px-3 py-1 text-xs border border-zinc-800 rounded hover:bg-zinc-800 text-zinc-400"
        >
          + Markdown
        </button>
      </div>
    </div>
  );
};

export default CustomCodeEditor;
