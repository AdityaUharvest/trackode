import mongoose, { Schema, Document } from 'mongoose';

interface IMockQuestion extends Document {
  mockTestId: mongoose.Types.ObjectId;
  section: string;
  text: string;
  options: string[];
  correctAnswer: number;
  
  difficulty: number;
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  mockTestId: { type: Schema.Types.ObjectId,  ref: 'MockTest' },
  section: { type: String},
  text: { type: String},
  options: { type: [String]},
  correctAnswer: { type: Number},
  
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MockQuestion || mongoose.model<IMockQuestion>('MockQuestion', QuestionSchema);