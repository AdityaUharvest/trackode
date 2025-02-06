import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        options: {
            type: [String],
            required: true,
        },
        correctAnswer: {
            type: [String], // Supports multiple correct answers
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium"
        },
        questionType: {
            type: String,
            enum: ["MCQ"],
            default: "MCQ"
        },
        image: {
            type: String,
        },
        explanation: {
            type: String,
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
        },
        order: { // Order of the question in the quiz
            type: Number,
            default: 0
        },
        timeLimit: {
            type: Number,
            default: 0
        },
        category: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Question = mongoose.models.Question || mongoose.model("Question", schema);
export default Question;