
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest,NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GAPI || "");
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction:
      'Return only the final requested content. Do not include any preface, acknowledgement, explanation, labels, markdown code fences, or phrases like "Okay", "Sure", "Here is", or "Here are". Output plain content only.'
  });

  try {
    const result = await model.generateContent(`
${prompt}

Important output rule: return only the final content and nothing else.
    `);
    const instructions = result.response.text();
    
    return NextResponse.json({ instructions });
  } catch (error) {
   return NextResponse.json({ message: 'Failed to generate' });
  }
}