// app/api/(tcs)/mock-tests/addSection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Section from '@/app/model/Section';
import connectDB from '@/lib/util';

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const sections = await Section.find({}).lean();
    return NextResponse.json({ sections }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { value, label, category } = await req.json();

    if (!value || !label) {
      return NextResponse.json({ error: 'Value and label are required' }, { status: 400 });
    }

    const existingSection = await Section.findOne({ value });
    if (existingSection) {
      return NextResponse.json({ error: 'Section already exists' }, { status: 400 });
    }

    const section = new Section({ value, label, category });
    await section.save();

    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
