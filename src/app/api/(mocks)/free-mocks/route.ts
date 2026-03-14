import connectDB from "@/lib/util";
import { NextRequest, NextResponse } from "next/server";
import MockTest from "@/app/model/MoockTest";
import MockQuestion from "@/app/model/MockQuestions";
export async function GET(request: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toUpperCase();
    
        const mocks = await MockTest.find(
        {tag: category}
        ).sort({ createdAt: -1 }).lean();

        const mockIds = mocks.map((mock: any) => mock._id);
        const sectionAggregation = await MockQuestion.aggregate([
            { $match: { mockTestId: { $in: mockIds } } },
            {
                $group: {
                    _id: {
                        mockTestId: '$mockTestId',
                        section: '$section',
                    },
                    questionCount: { $sum: 1 },
                },
            },
        ]);

        const sectionMap = sectionAggregation.reduce((acc: Record<string, Array<{ name: string; count: number }>>, item: any) => {
            const mockId = String(item._id?.mockTestId);
            const sectionName = String(item._id?.section || 'General').trim() || 'General';
            if (!acc[mockId]) {
                acc[mockId] = [];
            }
            acc[mockId].push({ name: sectionName, count: item.questionCount || 0 });
            return acc;
        }, {});

        const mappedMocks = mocks.map((mock: any) => {
            const key = String(mock._id);
            const sections = sectionMap[key] || [];
            return {
                ...mock,
                sections,
                questionCount: sections.reduce((sum, section) => sum + (section.count || 0), 0),
            };
        });

    if (mocks.length === 0) {
        return NextResponse.json(
            { message: "No mock tests found for the specified category." },
            { status: 404 }
        );
    }
    return NextResponse.json(
                { data: mappedMocks },
        { status: 200 }
    );
   
}