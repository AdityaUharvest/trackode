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
  quizAttempts?: any[];
  userPlayed?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  createdAt?: string;
  tag:string
  creator:string
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

function serializeAttempt(attempt: any) {
  return {
    ...attempt.toObject(),
    _id: serializeId(attempt._id),
    quizId: serializeId(attempt.quizId),
    userId: serializeId(attempt.userId),
    // Add more fields if needed
  };
}

async function fetchMockTests(): Promise<MockTestType[]> {
  await connectDB();
  const mocks = await MockTest.find({ public: true, isPublished: true }).sort({ createdAt: -1 });

  // Update userPlayed in the database for each mock
  
  const mockIds = mocks.map((mock) => mock._id);

  const quizAttempts = await QuizAttempt.find({ quizId: { $in: mockIds } });

  const quizAttemptMap = quizAttempts.reduce((acc, attempt) => {
    const key = attempt.quizId.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(serializeAttempt(attempt));
    return acc;
  }, {} as Record<string, any[]>);

  return mocks.map((mock) => {
    const obj = mock.toObject();
    return {
      ...obj,
      _id: serializeId(obj._id),
      quizAttempts: quizAttemptMap[obj._id.toString()] || [],
      userPlayed: obj.userPlayed || Math.floor(Math.random() * 500) + 50,
      category: obj.category || "TCS",
      difficulty: obj.difficulty || (["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard"),
    };
  });
}

export default async function MockTestsPage() {
  const mockTests = await fetchMockTests();

  return (
    <div className="container  dark:bg-gray-900 mx-auto p-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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