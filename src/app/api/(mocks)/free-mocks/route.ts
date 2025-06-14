import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import MockTest from "@/app/model/MoockTest";
export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toUpperCase();
    
    const mocks = await MockTest.find(
        {tag: category}
    ).sort({ createdAt: -1 });
    if (mocks.length === 0) {
        return NextResponse.json(
            { message: "No mock tests found for the specified category." },
            { status: 404 }
        );
    }
    return NextResponse.json(
        { data: mocks },
        { status: 200 }
    );
   
}