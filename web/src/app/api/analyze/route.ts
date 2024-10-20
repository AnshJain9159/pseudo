/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { parseCode, analyzeComplexity } from '@/utils/codeAnalysis';
import { generateFeedback } from '@/utils/feedBackGenerator';

export async function POST(req: NextRequest) {
  //parameters me code or code ki language aayegi
  const { code, language } = await req.json() as { code: string; language: string };

  try {
    //code ko parse karwakr usse analyzer me bhejdenge,
    const parsedCode = await parseCode(code, language);
    const analysis = await analyzeComplexity(parsedCode);
    //fir analysis ko feedback me bhejkr feedback return krwao
    const feedback = generateFeedback(analysis);

    return NextResponse.json({ analysis, feedback }); //response me feedback or complexity fekdi
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
