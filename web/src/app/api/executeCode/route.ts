import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const TIMEOUT = 5000; // 5 seconds
const MAX_BUFFER = 1024 * 1024; // 1 MB

export async function POST(request: NextRequest) {
  const { code, language } = await request.json();

  if (!code || !language) {
    return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
  }

  const allowedLanguages = ['python', 'cpp', 'c'];
  if (!allowedLanguages.includes(language)) {
    return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
  }

  const sanitizedCode = sanitizeCode(code);
  const fileName = `code_${crypto.randomBytes(16).toString('hex')}`;
  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, `${fileName}.${getFileExtension(language)}`);
  const outputPath = path.join(tmpDir, `${fileName}.out`);

  try {
    await fs.writeFile(filePath, sanitizedCode);
    const { output, error } = await executeCode(filePath, outputPath, language);
    
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 }); // Changed to 400 for compilation errors
    }
    
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Code execution failed' 
    }, { status: 500 });
  } finally {
    // Clean up the files
    try {
      await fs.unlink(filePath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    } catch (error) {
      console.error('File cleanup error:', error);
    }
  }
}

function sanitizeCode(code: string): string {
  // Basic sanitization: remove potential harmful system calls
  const forbiddenPatterns = [
    /system\s*\(/g,
    /exec\s*\(/g,
    /eval\s*\(/g,
    /shellexec\s*\(/g,
    /popen\s*\(/g,
    /proc_open\s*\(/g,
    /passthru\s*\(/g,
  ];

  let sanitizedCode = code;
  for (const pattern of forbiddenPatterns) {
    sanitizedCode = sanitizedCode.replace(pattern, '');
  }

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
        // Added -std=c++11 flag and separated compilation and execution
        command = `g++ -std=c++11 "${filePath}" -o "${outputPath}" && "${outputPath}"`;
        break;
      case 'c':
        command = `gcc "${filePath}" -o "${outputPath}" && "${outputPath}"`;
        break;
      default:
        return reject(new Error('Unsupported language'));
    }

    exec(command, { timeout: TIMEOUT, maxBuffer: MAX_BUFFER }, (error, stdout, stderr) => {
      if (error) {
        // Return compilation errors with more detail
        resolve({ 
          output: '', 
          error: stderr || error.message 
        });
      } else if (stderr) {
        // Handle warnings but successful compilation
        resolve({ 
          output: stdout,
          error: stderr 
        });
      } else {
        resolve({ output: stdout });
      }
    });
  });
}