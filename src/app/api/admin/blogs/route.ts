import { NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import Blog from '@/app/model/Blog';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  await connectDB();
  try {
    const blog = await Blog.create(data);
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { _id, ...update } = data;
  await connectDB();
  try {
    const blog = await Blog.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  try {
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
