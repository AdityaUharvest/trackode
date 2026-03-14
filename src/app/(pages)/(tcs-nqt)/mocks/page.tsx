import { Metadata } from "next";
import MockTestsListClient from "@/components/AvailableMocks";
import connectDB from "@/lib/util";
import MockTest from "@/app/model/MoockTest"; // Fixed typo: MoockTest → MockTest
import QuizAttempt from "@/app/model/QuizAttempt";

interface MockTestType {
  _id: string;
  title: string;
  durationMinutes: number;
  shareCode: string;
  attemptCount?: number;
  userPlayed?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  createdAt?: string;
  tag: string;
  creator: string;
}

// Metadata for SEO
export const metadata: Metadata = {
  title: "Free Mock Tests",
  description: "Practice and improve your coding skills with our collection of Free mock tests. Filter by difficulty, track your progress, and compete on leaderboards.",
  keywords: ["Free mock tests", "coding practice", "programming quizzes", "Trackode", "TCS mock tests"],
  openGraph: {
    title: "Free Mock Tests",
    description: "Join 500+ developers to practice TCS mock tests and enhance your programming skills.",
    url: "https://trackode.in/mocks",
    type: "website",
    images: [
      {
        url: "https://trackode.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Free Mock Tests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TCS Mock Tests | Trackode",
    description: "Practice TCS mock tests to level up your coding skills.",
    images: ["https://trackode.in/og-image.jpg"],
  },
};
// ...existing code...

function serializeId(id: any) {
  return id?.toString ? id.toString() : id;
}

async function fetchMockTests(): Promise<MockTestType[]> {
  await connectDB();
  const mocks = await MockTest.find({ public: true, isPublished: true })
    .select('title durationMinutes shareCode userPlayed category difficulty createdAt tag creator')
    .sort({ createdAt: -1 })
    .lean();

  const mockIds = mocks.map((mock: any) => mock._id);
  const attemptCounts = await QuizAttempt.aggregate([
    { $match: { quizId: { $in: mockIds } } },
    { $group: { _id: '$quizId', count: { $sum: 1 } } }
  ]);

  const attemptCountMap = new Map<string, number>();
  attemptCounts.forEach((item: any) => {
    attemptCountMap.set(serializeId(item._id), item.count || 0);
  });

  return mocks.map((obj: any) => {
    const mockId = serializeId(obj._id);
    return {
      _id: mockId,
      title: obj.title || '',
      durationMinutes: obj.durationMinutes || 60,
      shareCode: obj.shareCode || '',
      attemptCount: attemptCountMap.get(mockId) || 0,
      userPlayed: obj.userPlayed || Math.floor(Math.random() * 500) + 50,
      category: obj.category || "TCS",
      difficulty: obj.difficulty || (["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard"),
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      tag: obj.tag || 'TCS',
      creator: obj.creator || 'Anonymous',
    };
  });
}

export default async function MockTestsPage() {
  const mockTests = await fetchMockTests();

  return (
    <div className="container mt-5 mx-auto lg:p-7 p-2 max-w-7xl">
      <div className="mb-8  text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Free Mock Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Practice with our collection of mock tests and improve your skills
        </p>
      </div>
      <MockTestsListClient initialTests={mockTests} />
      
    </div>
  );
}