import { NextRequest } from "next/server";
import connectDB from "@/lib/util";
import Section from "@/app/model/Section";
import { NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    await connectDB();
    const sections = await Section.find();
    return NextResponse.json(
        {sections}
    )
}