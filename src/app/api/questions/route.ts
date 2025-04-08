import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/model/Quiz";
import Question from "@/app/model/Question";
import connectDB from "@/lib/util";



export async function POST(req: NextRequest, { params }: any) {
  try {
    await connectDB();

    const { quizId, questions, category, difficulty, questionType, image, explanation, shuffleOptions, order, timeLimit } = await req.json();
    console.log(quizId)
    // console.log(questions)
    if (!quizId) {
      return NextResponse.json({
        message: "Please provide quiz id",
        success: false,
      }, { status: 400 });
    }
    
    // const quest= JSON.parse(questions);
    
    if (!questions || questions.length === 0) {
      return NextResponse.json({
        message: "Please provide questions",
        success: false,
      }, { status: 400 });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({
        message: "Quiz not found",
        success: false,
      }, { status: 404 });
    }
    
    const savedQuestions = [];
    const errors = [];
    
    // Loop through each question and save it
    for (const questionData of questions) {
     
      if (!questionData.options || !questionData.question || !questionData.correctAnswer) {
        errors.push({
          message: "Missing required fields for a question",
          question: questionData,
        });
        continue;
      }

      const newQuestionData = {
        options: questionData.options,
        question: questionData.question,
        correctAnswer: questionData.correctAnswer,
        category: category,
        difficulty: difficulty,
        questionType: questionType,
        image: image,
        explanation: explanation,
        shuffleOptions: shuffleOptions || false,
        order: order,
        timeLimit: timeLimit,
        quiz: quizId,
      };

      try {
        const newQuestion = new Question(newQuestionData);
        await newQuestion.save();
        savedQuestions.push(newQuestion._id);
      } catch (error) {
        console.error("Error saving question:", error);
        errors.push({
          message: "Failed to save a question",
          question: questionData,
          error
        });
      }
    }

    // Update the quiz with the new question IDs
    if (savedQuestions.length > 0) {
      await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { questions: { $each: savedQuestions } } },
        { new: true }
      );
    }
    console.log("Questions added successfully");

    return NextResponse.json({
      message: `Successfully added ${savedQuestions.length} questions. ${errors.length} questions failed.`,
      success: true,
      savedQuestions,
      errors,
    });

  } catch (error: any) {
    console.error("Error adding questions:", error);
    return NextResponse.json({
      message: error.message || "Failed to add questions",
      success: false,
    }, { status: 500 });
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
  console.log(id);
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
  const {  questionId,newQuestion, category, difficulty, questionType, image, explanation, shuffleOptions, order, timeLimit } = await request.json();
  const id= questionId;
  // console.log(newQuestion)
  if (!id) {
    return NextResponse.json({
      message: "Please provide question id",
      success: false
    }, { status: 400 });
  }

  // update that field only which is provided
  const newQuestionData = {
    options: newQuestion.options,
    question: newQuestion.question,
    correctAnswer: newQuestion.correctAnswer,
    category: category,
    difficulty: difficulty,
    questionType: questionType,
    image: image,
    explanation: explanation,
    shuffleOptions: shuffleOptions || false,
    order: order,
    timeLimit: timeLimit,
  };

  try {
    const question = await Question.findByIdAndUpdate(id, newQuestionData, { new: true });

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