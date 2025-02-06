import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Question from "@/app/model/Question";
import connectDB from "@/lib/util";

export async function POST(req: NextRequest, { params }: any) {
  try {
    await connectDB();

    const { id, options, question, correctAnswer, category, difficulty, questionType, image, explanation, shuffleOptions, order, timeLimit } = await req.json();

    if (!id) {
      return NextResponse.json({
        message: "Please provide quiz id",
        success: false
      }, { status: 400 });
    }

    if (!options || !question || !correctAnswer) {
      return NextResponse.json({
        message: "Missing required fields",
        success: false,
      });
    }

    const newQuestionData = {
      options,
      question,
      correctAnswer,
      category,
      difficulty: difficulty || "Medium",
      questionType: questionType || "MCQ",
      image: image || "",
      explanation: explanation || "",
      order: order || 0,
      timeLimit: timeLimit || 0,
      quiz: id
    };

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json({
        message: "Quiz not found",
        success: false,
      });
    }

    const newQuestion = new Question(newQuestionData);
    await newQuestion.save();

    await Quiz.findByIdAndUpdate(
      id,
      { $push: { questions: newQuestion._id } },
      { new: true }
    );

    return NextResponse.json({
      message: "Question added successfully",
      success: true,
      questionId: newQuestion._id,
    });

  } catch (error: any) {
    console.error("Error adding question:", error);
    return NextResponse.json({
      message: error.message || "Failed to add question",
      success: false
    });
  }
}

export async function GET(request: NextRequest) {
  // This function is used to get all questions of a particular quiz
  await connectDB();

  const id = request.json(); // quiz id
  if (!id) {
    return NextResponse.json({
      message: "Please provide quiz id",
      success: false
    }, { status: 400 });
  }

  try {
    const questions = await Question.find({ quiz: id });

    return NextResponse.json({
      message: "Questions found",
      success: true,
      questions
    });

  } catch (error) {
    return NextResponse.json({
      message: error || "Failed to get questions",
      success: false
    });
  }
}


export async function DELETE(request: NextRequest) {
  await connectDB();

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({
      message: "Please provide question id",
      success: false
    }, { status: 400 });
  }
  try {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return NextResponse.json({
        message: "Question not found",
        success: false
      }, { status: 404 });
    }

    await Quiz.updateMany(
      { questions: id },
      { $pull: { questions: id } }
    );

    return NextResponse.json({
      message: "Question deleted successfully",
      success: true
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      message: error || "Failed to delete question",
      success: false
    });
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();

  const { id, options, question, correctAnswer, category, difficulty, questionType, image, explanation, shuffleOptions, order, timeLimit } = await request.json();
  if (!id) {
    return NextResponse.json({
      message: "Please provide question id",
      success: false
    }, { status: 400 });
  }

  // update that field only which is provided
  const questionData = {
    options,
    question,
    correctAnswer,
    category,
    difficulty,
    questionType,
    image,
    explanation,
    shuffleOptions,
    order,
    timeLimit
  };

  try {
    const question = await Question.findByIdAndUpdate(id, questionData, { new: true });

    if (!question) {
      return NextResponse.json({
        message: "Question not found",
        success: false
      }, { status: 404 });
    }

    return NextResponse.json({
      message: "Question updated successfully",
      success: true
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      message: error || "Failed to update question",
      success: false
    });
  }
}