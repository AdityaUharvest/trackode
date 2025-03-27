import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import connectDB from "@/lib/util";
import Question from "@/app/model/Question";

// Fisher–Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // Create a copy to avoid mutating the original
  let currentIndex = newArray.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}

export async function GET(req: NextRequest, { params }: any) {
  await connectDB();
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        message: "Quiz ID is required",
        success: false,
      }, { status: 400 });
    }

    const quiz = await Quiz.findById(id).populate("questions");
    if (!quiz) {
      return NextResponse.json({
        message: "No quiz found",
        success: false,
      }, { status: 404 });
    }

    // Create a deep copy of the quiz to avoid modifying the original
    const quizResponse = JSON.parse(JSON.stringify(quiz));

    // Shuffle questions if needed
    if (quiz.shuffleQuestions) {
      quizResponse.questions = shuffleArray(quizResponse.questions);
    }

    // Shuffle options for each question if needed
    if (quiz.shuffleOptions) {
      quizResponse.questions = quizResponse.questions.map((question: any) => {
        return {
          ...question,
          options: shuffleArray(question.options)
        };
      });
    }
    console.log(quizResponse);
    console.log(quiz.shuffleQuestions);
    console.log(quiz.shuffleOptions);
    return NextResponse.json({
      message: "Quiz found",
      success: true,
      quiz: quizResponse,
      shuffleInfo: {
        questionsShuffled: quiz.shuffleQuestions,
        optionsShuffled: quiz.shuffleOptions
      }
    });

  } catch (error) {
    console.error("Error in GET /api/quiz:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}