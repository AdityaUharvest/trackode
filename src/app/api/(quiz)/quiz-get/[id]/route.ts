import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import connectDB from "@/lib/util";

// Fisher–Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export async function GET(req: NextRequest, { params }: any) {
  await connectDB();
  try {
    const { id } = params;
    console.log(id);
    if (req.method === "GET") {
      try {
        const quiz = await Quiz.findById(id).populate("questions");
        if (!quiz) {
          return NextResponse.json({
            message: "No quiz found",
            success: false,
          });
        }

        // Shuffle the questions array before sending the response
        if(quiz.shuffleOptions){
            quiz.questions = shuffleArray(quiz.questions);
        }
        

        return NextResponse.json({
          message: "Quiz found",
          success: true,
          quiz,
        });
      } catch (error) {
        return NextResponse.json({
          message: "Error occurred",
          success: false,
          error: `${error}`,
        });
      }
    } else {
      return NextResponse.json({
        message: "Method not allowed",
        success: false,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Unwanted error occurred",
      success: false,
      error: `${error}`,
    });
  }
}
