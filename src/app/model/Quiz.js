import mongoose from "mongoose";
import Question from "./Question";
import User from "./User";
import { type } from "os";

const quizSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            
        },
        startDate: {
            type: Date,
            // required: true
        },
        endDate: {
            type: Date,
            // required: true
        },
        startTime:{
            type: String,
            
        },
        endTime:{
            type:String,
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
        instructions: {
            type: String,
            
        },
       
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
    },
    { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;