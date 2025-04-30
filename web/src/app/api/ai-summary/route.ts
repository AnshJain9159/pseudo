/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

function buildSummaryPrompt(chat: { role: string; content: string }[]) {
  const chatHistory = chat
    .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
    .join("\n");

  return `
You are an expert Computer Science tutor. Summarize the following Socratic-style conversation between a student and an AI tutor into clear, concise reference notes. Focus on key concepts, explanations, and important questions discussed. Use bullet points or short paragraphs for clarity.

Conversation:
${chatHistory}

Summary (as reference notes):
`;
}

export async function POST(req: NextRequest) {
  try {
    const { chat } = await req.json();

    if (!chat || !Array.isArray(chat)) {
      return new Response(JSON.stringify({ error: "Invalid chat data" }), { status: 400 });
    }

    const prompt = buildSummaryPrompt(chat);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}