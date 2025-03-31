import mongoose, { Schema, Document } from 'mongoose';

interface ISectionTime {
  sectionName: string;
  timeSpent: number; // in seconds
  timeLimit?: number; // in seconds
  completed: boolean;
}

interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: string;
  userName?: string;
  email?: string;
  
  // Quiz metadata
  quizTitle: string;
  quizType?: string;
  quizDescription?: string;
  quizDuration?: number; // in minutes
  totalQuestions: number;
  
  // Timing information
  startedAt: Date;
  completedAt?: Date;
  lastActivityAt: Date;
  timeSpent: number; // Total in seconds
  
  // Section-wise tracking
  sectionTimes: ISectionTime[];
  currentSection?: string;
  
  // Answers tracking
  answers: Record<string, Record<string, number>>; // section -> questionId -> answerIndex
  correctAnswers?: number;
  incorrectAnswers?: number;
  unansweredQuestions?: number;
  
  // Device/browser info
  deviceType?: string;
  browser?: string;
  os?: string;
  
  // Status flags
  isCompleted: boolean;
  wasInterrupted: boolean;
  interruptionReason?: string;
}

const SectionTimeSchema = new Schema({
  sectionName: { type: String, required: true },
  timeSpent: { type: Number, required: true },
  timeLimit: Number,
  completed: { type: Boolean, default: false }
});

const QuizAttemptSchema: Schema = new Schema({
  // Core identifiers
  quizId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'MockTest' 
  },
  userId: { 
    type: String, 
    required: true 
  },
  userName: String,
  email: String,

  // Quiz metadata
  quizTitle: { 
    type: String, 
    required: true 
  },
  quizType: String,
  quizDescription: String,
  quizDuration: Number, // in minutes
  totalQuestions: {
    type: Number,
    default: 0
  },

  // Timing information
  startedAt: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  completedAt: Date,
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number,
    default: 0 // in seconds
  },

  // Section tracking
  sectionTimes: [SectionTimeSchema],
  currentSection: String,

  // Answers tracking
  answers: { 
    type: Schema.Types.Mixed, 
    default: {} 
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  unansweredQuestions: {
    type: Number,
    default: 0
  },

  // Technical info
  deviceType: String,
  browser: String,
  os: String,

  // Status flags
  isCompleted: {
    type: Boolean,
    default: false
  },
  wasInterrupted: {
    type: Boolean,
    default: false
  },
  interruptionReason: String
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for faster queries
QuizAttemptSchema.index({ quizId: 1, userId: 1 });
QuizAttemptSchema.index({ userId: 1 });
QuizAttemptSchema.index({ completedAt: 1 });
QuizAttemptSchema.index({ isCompleted: 1 });

// Middleware to update lastActivityAt before save
QuizAttemptSchema.pre('save', function(next) {
  this.lastActivityAt = new Date();
  
  // Calculate time spent if not completed
  if (!this.isCompleted) {
    this.timeSpent = Math.floor((this.lastActivityAt.getTime() - this.startedAt.getTime()) / 1000);
  }
  
  next();
});

// Static method to mark an attempt as completed
QuizAttemptSchema.statics.markAsCompleted = async function(attemptId: string) {
  return this.findByIdAndUpdate(
    attemptId,
    { 
      isCompleted: true,
      completedAt: new Date(),
      timeSpent: Math.floor((new Date().getTime() - this.startedAt.getTime()) / 1000)
    },
    { new: true }
  );
};

// Static method to mark an attempt as interrupted
QuizAttemptSchema.statics.markAsInterrupted = async function(
  attemptId: string, 
  reason: string
) {
  return this.findByIdAndUpdate(
    attemptId,
    { 
      wasInterrupted: true,
      interruptionReason: reason,
      lastActivityAt: new Date(),
      timeSpent: Math.floor((new Date().getTime() - this.startedAt.getTime()) / 1000)
    },
    { new: true }
  );
};

export default mongoose.models.QuizAttempt || 
       mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);