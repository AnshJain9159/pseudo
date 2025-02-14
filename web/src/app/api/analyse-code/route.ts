/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { parseCode, analyzeComplexity } from 'utils/codeAnalysis';
import { generateFeedback } from 'utils/feedBackGenerator';

interface AnalyzeRequest {
  code: string;
  language: 'javascript' | 'python' | 'cpp'; // Specify supported languages
}

export async function POST(req: NextRequest) {
  const { code, language } = await req.json() as AnalyzeRequest;

  // Validate language
  if (!['javascript', 'python', 'cpp'].includes(language)) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  try {
    const parsedCode = await parseCode(code, language);
    const analysis = await analyzeComplexity(parsedCode);
    const feedback = generateFeedback(analysis);

    return NextResponse.json({ analysis, feedback });
  } catch (error: any) {
    console.error("Error during code analysis:", error); // Log the error
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}