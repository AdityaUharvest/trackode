import mongoose from "mongoose";
const feedBackSchema = new mongoose.Schema({
    quizId: { type: String, required: true },
    // feedback: { type: String, required: true },
    rating: { type: Number, required: true },
    difficulty: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedBackSchema);
export default Feedback;