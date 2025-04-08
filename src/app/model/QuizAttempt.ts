import mongoose, { Schema, Document } from 'mongoose';
import MockTest from './MoockTest';
interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: Record<string, Record<string, number>>;
}

const QuizAttemptSchema: Schema = new Schema({
  quizId: { type: Schema.Types.ObjectId, required: true, ref: 'MockTest' },
  userId: { type: String, required: true },
  startedAt: { type: Date, required: true },
  completedAt: Date,
  answers: { type: Schema.Types.Mixed, default: {} },
  quizTitle: { type: String, required: true },

  userName: { type: String },
  email: { type: String },
  quizType: { type: String },
  quizDuration: { type: Number },
  quizStartTime: { type: Date },
  quizEndTime: { type: Date },

  quizDescription: { type: String},
});

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);