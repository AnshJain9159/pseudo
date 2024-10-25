/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { parseCode, analyzeComplexity } from '@/utils/codeAnalysis';
import { generateFeedback } from '@/utils/feedBackGenerator';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface AnalyzeRequest {
  code: string;
  language: 'javascript' | 'python' | 'cpp'; // Specify supported languages
}

export async function POST(req: NextRequest) {
  try {
    const { code, language } = (await req.json()) as AnalyzeRequest;

    // Validate request body
    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    // Validate language
    if (!['javascript', 'python', 'cpp'].includes(language)) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    // Handle analysis based on language
    let parsedCode: any;
    try {
      if (language === 'javascript') {
        // Parse JavaScript code directly using in-built JavaScript parser
        parsedCode = await parseCode(code, language);
      } else if (language === 'python') {
        // Execute external Python parser script
        parsedCode = await runPythonParser(code);
      } else if (language === 'cpp') {
        // Execute external C++ parser script
        parsedCode = await runCppParser(code);
      } else {
        throw new Error('Unsupported language');
      }

      // Analyze the parsed code and generate complexity analysis
      const analysis = await analyzeComplexity(parsedCode);
      const feedback = generateFeedback(analysis);

      return NextResponse.json({ analysis, feedback });
    } catch (parseError: any) {
      console.error('Error during parsing or analysis:', parseError);
      return NextResponse.json({ error: parseError.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error during code analysis:', error); // Log the error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to run the Python parser script
async function runPythonParser(code: string): Promise<any> {
  const scriptPath = path.resolve('./src/scripts/parse_python.py');
  const pythonPath = `"C:\\Users\\anshj\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"`;
  const command = `${pythonPath} ${scriptPath} "${code.replace(/"/g, '\\"')}"`; // Pass code as a command-line argument
  const { stdout, stderr } = await execAsync(command);

  if (stderr) {
    throw new Error(`Python parser error: ${stderr}`);
  }
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error('Failed to parse Python output');
  }
}

// Helper function to run the C++ parser script
async function runCppParser(code: string): Promise<any> {
  const scriptPath = path.resolve('./src/scripts/parse_c.py');
  const pythonPath = `"C:\\Users\\anshj\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"`;
  const command = `${pythonPath} ${scriptPath} "${code.replace(/"/g, '\\"')}"`; // Pass code as a command-line argument
  const { stdout, stderr } = await execAsync(command);

  if (stderr) {
    throw new Error(`C++ parser error: ${stderr}`);
  }
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error('Failed to parse C++ output');
  }
}
