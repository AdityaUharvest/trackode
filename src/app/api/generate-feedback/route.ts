
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest,NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const genAI = new GoogleGenerativeAI('AIzaSyAJViRKMlEQfA5lFVzrr2Yyo9_gxsH-1o8');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  try {
    const result = await model.generateContent(prompt);
    const instructions = result.response.text();
    
    return NextResponse.json({ instructions });
  } catch (error) {
   return NextResponse.json({ message: 'Failed to generate' });
  }
}