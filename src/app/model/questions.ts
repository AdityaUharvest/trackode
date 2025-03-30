import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion extends Document {
  mockTestId: mongoose.Types.ObjectId;
  section: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: number;
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  mockTestId: { type: Schema.Types.ObjectId, required: true, ref: 'MockTest' },
  section: { type: String, required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: String,
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);