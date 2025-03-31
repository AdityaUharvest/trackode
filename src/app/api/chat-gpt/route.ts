// pages/api/generate-instructions.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Define types for better type safety
type RequestData = {
  prompt: string;
};

type ResponseData = {
  instructions: string;
  error?: string;
};

export  async function POST(
  req: NextRequest,
) {
  // Only accept POST requests
  

  try {
    // Extract the prompt from the request body
    const { prompt } = await req.json();

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ 
        instructions: '', 
        error: 'Invalid prompt. Please provide a text prompt.'
      });
    }

    // Initialize the OpenAI client with DeepSeek configuration
    const openai = new OpenAI({
      
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Send the request to DeepSeek
    const completion = await openai.chat.completions.create({
      messages: [
        
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
    });

    // Extract the response content
    const instructions = completion.choices[0].message.content || '';

    // Return the instructions
    return NextResponse.json({ instructions });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      instructions: '', 
      error: 'Failed to generate instructions. Please try again later.'
    });
  }
}