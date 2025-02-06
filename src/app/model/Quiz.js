import mongoose from "mongoose";
import Question from "./Question";
const quizSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalMarks: {
            type: Number,
            required: true,
            min: 0
        },
        totalQuestions: {
            type: Number,
            required: true,
            min: 1
        },
        duration: { type: Number, default: 0 }, // In minutes (0 = no limit)
        negativeMarking: { type: Boolean, default: false },
        isPaid: { type: Boolean, default: false },
        price: { type: Number, default: 0 },
        shuffleOptions: {
            type: Boolean,
            default: false
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        active: {
            type: Boolean,
            default: false
        },
        published: { // Quiz is published and visible to users
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;