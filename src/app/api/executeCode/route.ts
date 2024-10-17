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

  try {
    await fs.writeFile(filePath, sanitizedCode);
    const output = await executeCode(filePath, language);
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json({ error: 'Code execution failed' }, { status: 500 });
  } finally {
    // Clean up the file
    try {
      await fs.unlink(filePath);
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
    // java: 'java'
  };
  return extensions[language];
}

function executeCode(filePath: string, language: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let command: string;

    switch (language) {
      case 'python':
        command = `python "${filePath}"`;
        break;
      case 'cpp':
        command = `g++ "${filePath}" -o "${filePath}.out" && "${filePath}.out"`;
        break;
      case 'c':
        command = `gcc "${filePath}" -o "${filePath}.out" && "${filePath}.out"`;
        break;
      // case 'java':
      //   const className = path.basename(filePath, '.java');
      //   command = `javac "${filePath}" && java -cp "${path.dirname(filePath)}" ${className}`;
      //   break;
      default:
        return reject(new Error('Unsupported language'));
    }

    exec(command, { timeout: TIMEOUT, maxBuffer: MAX_BUFFER }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}