import { Metadata } from "next";
import MockTestsListClient from "@/components/AvailableMocks";
import connectDB from "@/lib/util";
import MockTest from "@/app/model/MoockTest"; // (Check spelling if it's not typo!)
import QuizAttempt from "@/app/model/QuizAttempt";

interface MockTestType {
  _id: string;
  title: string;
  durationMinutes: number;
  shareCode: string;
  quizAttempts?: any[];
  userPlayed?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  createdAt?: string;
}

// Metadata for SEO
export const metadata: Metadata = {
  title: "Free Mock Tests | Trackode",
  description: "Practice and improve your coding skills with our collection of Free mock tests. Filter by difficulty, track your progress, and compete on leaderboards.",
  keywords: ["Free mock tests", "coding practice", "programming quizzes", "Trackode", "TCS mock tests"],
  openGraph: {
    title: "Free Mock Tests | Trackode",
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

async function fetchMockTests(): Promise<MockTestType[]> {
  await connectDB();

  const mocks = await MockTest.find({ public: true, isPublished: true }).sort({ createdAt: -1 });

  const mockIds = mocks.map((mock) => mock._id);

  const quizAttempts = await QuizAttempt.find({ quizId: { $in: mockIds } });

  const quizAttemptMap = quizAttempts.reduce((acc, attempt) => {
    const key = attempt.quizId.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(attempt);
    return acc;
  }, {} as Record<string, any[]>);

  return mocks.map((mock) => ({
    ...mock.toObject(),
    quizAttempts: quizAttemptMap[mock._id.toString()] || [],
    userPlayed: mock.userPlayed || Math.floor(Math.random() * 500) + 50,
    category: mock.category || "TCS",
    difficulty: mock.difficulty || (["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard"),
  }));
}

export default async function MockTestsPage() {
  const mockTests = await fetchMockTests();

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TCS Mock Tests
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Practice with our collection of mock tests and improve your skills
        </p>
      </div>
      <MockTestsListClient initialTests={mockTests} />
    </div>
  );
}
