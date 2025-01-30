import mongoose from "mongoose";
// now we will create a schema for the question
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
            type: Number,
            required: true,
        },
        image: {
            type: String, 
        },
        explanation: {
            type: String,
        },
        // joining the question with the quiz-foreign key will be quiz._id (auto generated)
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
        },
        slug:{
            type:String,
            required:true,
        }


    },
    { timestamps: true }
    
)
const Question = mongoose.models.Question || mongoose.model("Question", schema);
export default Question;