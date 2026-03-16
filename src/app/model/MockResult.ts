import mongoose, { Document, Schema } from 'mongoose';

interface IQuestionResult {
  questionId: mongoose.Types.ObjectId;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface ISectionResult {
  sectionName: string;
  correct: number;
  total: number;
  questions: IQuestionResult[];
}

interface IQuestionFeedback {
  questionId: mongoose.Types.ObjectId;
  explanation: string;
  generatedAt: Date;
}

interface ISectionFeedback {
  sectionName: string;
  feedback: string;
  generatedAt: Date;
}

interface IOverallFeedback {
  content: string;
  generatedAt: Date;
}

interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  quizTitle: string;
  attemptId: mongoose.Types.ObjectId;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  rank: number; // New field for storing rank
  mailSent: boolean;
  sections: ISectionResult[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  overallFeedback?: IOverallFeedback;
  sectionFeedbacks?: ISectionFeedback[];
  questionFeedbacks?: IQuestionFeedback[];
}

const QuestionResultSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  userAnswer: { type: Number, required: true },
  correctAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true }
});

const SectionResultSchema = new Schema({
  sectionName: { type: String, required: true },
  correct: { type: Number, required: true },
  total: { type: Number, required: true },
  questions: [QuestionResultSchema]
});

const QuestionFeedbackSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  explanation: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
});

const SectionFeedbackSchema = new Schema({
  sectionName: { type: String, required: true },
  feedback: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
});

const OverallFeedbackSchema = new Schema({
  content: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
});

const QuizResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'MockTest', required: true },
  quizTitle: { type: String,default:'Trackode quiz' },
  attemptId: { type: Schema.Types.ObjectId, ref: 'QuizAttempt', required: true },
  totalScore: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  rank: { type: Number, default: 0 }, // New field for rank
  mailSent: { type: Boolean, default: false }, // New field to track if mail has been sent
  sections: [SectionResultSchema],
  completedAt: { type: Date, required: true },
  overallFeedback: OverallFeedbackSchema,
  sectionFeedbacks: [SectionFeedbackSchema],
  questionFeedbacks: [QuestionFeedbackSchema]
}, { timestamps: true });

export default mongoose.models.MockResult || mongoose.model<IQuizResult>('MockResult', QuizResultSchema);