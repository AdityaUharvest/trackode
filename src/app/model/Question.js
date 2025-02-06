import mongoose from "mongoose";
import Quiz from "./Quiz";

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String], // Array of strings for multiple options
            required: true
        },
        correctAnswer: {
            type: String, // Supports multiple correct answers
            required: true
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
            type: String, // Optional image URL
        },
        explanation: {
            type: String, // Explanation for the answer
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },
        order: { 
            type: Number, // Order of the question in the quiz
            default: 0
        },
        timeLimit: {
            type: Number, // Time limit in seconds (if applicable)
            default: 0
        },
        category: {
            type: String, // Category for better organization
        }
    },
    { timestamps: true }
);

// Export the model
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
export default Question;
