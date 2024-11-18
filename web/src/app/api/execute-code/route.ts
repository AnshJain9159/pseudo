import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const TIMEOUT = 5000; // 5 seconds timeout for the execution
const MAX_BUFFER = 1024 * 1024; // 1 MB buffer size for stdout/stderr

export async function POST(request: NextRequest) {
  const { code, language } = await request.json();

  if (!code || !language) {
    return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
  }

  const allowedLanguages = ['python', 'cpp', 'c'];
  if (!allowedLanguages.includes(language)) {
    return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
  }

  const sanitizedCode = sanitizeCode(code); // Optional: remove unsafe code
  const fileName = `code_${crypto.randomBytes(16).toString('hex')}`;
  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, `${fileName}.${getFileExtension(language)}`);
  const outputPath = path.join(tmpDir, `${fileName}.out`);

  try {
    // Write the code to a file
    await fs.writeFile(filePath, sanitizedCode);
    
    // Execute the code (compile + run)
    const { output, error } = await executeCode(filePath, outputPath, language);

    if (error) {
      return NextResponse.json({ error }, { status: 400 }); // Compilation or execution error
    }

    return NextResponse.json({ output }); // Send back the program output
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Code execution failed',
    }, { status: 500 });
  } finally {
    // Cleanup temporary files
    try {
      await fs.unlink(filePath);
      await fs.unlink(outputPath);
    } catch (cleanupError) {
      console.error('Error cleaning up files:', cleanupError);
    }
  }
}

// Sanitize input code (optional)
function sanitizeCode(code: string): string {
  const forbiddenPatterns = [
    /system\s*\(/g, /exec\s*\(/g, /eval\s*\(/g, /shellexec\s*\(/g, /popen\s*\(/g,
  ];

  let sanitizedCode = code;
  forbiddenPatterns.forEach((pattern) => {
    sanitizedCode = sanitizedCode.replace(pattern, '');
  });

  return sanitizedCode;
}

function getFileExtension(language: string): string {
  const extensions: { [key: string]: string } = {
    python: 'py',
    cpp: 'cpp',
    c: 'c',
  };
  return extensions[language];
}

function executeCode(filePath: string, outputPath: string, language: string): Promise<{ output: string; error?: string }> {
  return new Promise((resolve, reject) => {
    let command: string;

    switch (language) {
      case 'python':
        command = `python "${filePath}"`;
        break;
      case 'cpp':
        // Compile and execute C++ code
        command = `g++ "${filePath}" -o "${outputPath}" && "${outputPath}"`;
        break;
      case 'c':
        // Compile and execute C code
        command = `gcc "${filePath}" -o "${outputPath}" && "${outputPath}"`;
        break;
      default:
        return reject(new Error('Unsupported language'));
    }

    exec(command, { timeout: TIMEOUT, maxBuffer: MAX_BUFFER }, (error, stdout, stderr) => {
      if (error || stderr) {
        resolve({ output: '', error: stderr || "error" });
      } else {
        resolve({ output: stdout });
      }
    });
  });
}
