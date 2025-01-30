import mongoose from "mongoose";
import Question from "./Question";
import User from "./User";
const quizSchema = new mongoose.Schema(
    {
        name: {
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
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        totalMarks: {
            type: Number,
            required: true
        },
        totalQuestions: {
            type: Number,
            required: true
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        active: {
            type: Boolean,
        },
        published: {
            type: Boolean,
            default: false
        },
        slug:{
            type:String,
            required:true,
        }
    },
    { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;
