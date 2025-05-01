// import { NextRequest, NextResponse } from 'next/server';
// import { parseCode, analyzeComplexity } from '@/utils/codeAnalysis';
// import { generateFeedback } from '@/utils/feedBackGenerator';
// import { spawn } from 'child_process';
// import path from 'path';

// // Helper function to get the project root directory
// function getProjectRoot() {
//   return path.resolve(process.cwd(),'..');
// }

// // Helper function to get the virtual environment Python path
// function getVenvPythonPath() {
//   const projectRoot = getProjectRoot();
//   const isWindows = process.platform === 'win32';
//   const venvPath = path.join(projectRoot, '.venv');
  
//   if (isWindows) {
//     return path.join(venvPath, 'Scripts', 'python.exe');
//   }
//   return path.join(venvPath, 'bin', 'python');
// }

// // Helper function to get script paths
// function getScriptPath(scriptName: string) {
//   // Scripts are in the web/src/scripts directory
//   return path.join(process.cwd(), 'src', 'scripts', scriptName);
// }

// interface AnalyzeRequest {
//   code: string;
//   language: 'javascript' | 'python' | 'c';
// }

// interface ParserResult {
//   parsed: any;
//   error?: string;
// }

// // Helper function to run Python scripts with proper error handling
// async function runPythonScript(scriptPath: string, code: string): Promise<ParserResult> {
//   const pythonPath = getVenvPythonPath();

//   // Log paths for debugging
//   console.log('Project Root:', getProjectRoot());
//   console.log('Python Path:', pythonPath);
//   console.log('Script Path:', scriptPath);

//   return new Promise((resolve, reject) => {
//     const process = spawn(pythonPath, [scriptPath]);
//     let stdoutData = '';
//     let stderrData = '';

//     process.on('error', (error) => {
//       console.error('Failed to start Python process:', error);
//       reject(new Error(`Failed to start Python process: ${error.message}. Python path: ${pythonPath}`));
//     });

//     // Send code to the Python script
//     process.stdin.write(code);
//     process.stdin.end();

//     process.stdout.on('data', (data) => {
//       stdoutData += data.toString();
//     });

//     process.stderr.on('data', (data) => {
//       stderrData += data.toString();
//     });

//     process.on('close', (code) => {
//       if (code !== 0) {
//         console.error('Python process stderr:', stderrData);
//         reject(new Error(`Python process exited with code ${code}: ${stderrData}`));
//         return;
//       }

//       try {
//         const result = JSON.parse(stdoutData);
//         if (result.error) {
//           reject(new Error(result.error));
//           return;
//         }
//         resolve({ parsed: result });
//       } catch (error) {
//         reject(new Error('Failed to parse Python script output'));
//       }
//     });
//   });
// }

// // Language-specific parsers
// const parsers = {
//   javascript: async (code: string): Promise<ParserResult> => {
//     try {
//       const parsed = await parseCode(code, 'javascript');
//       return { parsed };
//     } catch (error) {
//       throw new Error(`JavaScript parsing error: ${error}`);
//     }
//   },

//   python: async (code: string): Promise<ParserResult> => {
//     const scriptPath = getScriptPath('parse_python.py');
//     return runPythonScript(scriptPath, code);
//   },

//   c: async (code: string): Promise<ParserResult> => {
//     const scriptPath = getScriptPath('parse_c.py');
//     return runPythonScript(scriptPath, code);
//   }
// };

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json() as AnalyzeRequest;

//     // Input validation
//     if (!body.code?.trim()) {
//       return NextResponse.json({ error: 'Code is required' }, { status: 400 });
//     }

//     if (!body.language || !['javascript', 'python', 'c'].includes(body.language)) {
//       return NextResponse.json(
//         { error: 'Unsupported language. Must be one of: javascript, python, c' },
//         { status: 400 }
//       );
//     }

//     try {
//       // Parse the code using the appropriate parser
//       const parser = parsers[body.language];
//       const { parsed } = await parser(body.code);

//       // Analyze the parsed code
//       const analysis = await analyzeComplexity(parsed);
//       const feedback = generateFeedback(analysis);

//       return NextResponse.json({ analysis, feedback });

//     } catch (parseError: any) {
//       console.error('Error during parsing or analysis:', parseError);
//       return NextResponse.json(
//         { error: parseError.message },
//         { status: 500 }
//       );
//     }

//   } catch (error: any) {
//     console.error('Error processing request:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }