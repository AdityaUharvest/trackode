
import mongoose, { Schema, Document } from 'mongoose';
import User from './User';
interface IMockTest extends Document {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  isPublished: boolean;
  shareCode: string;
  createdAt: Date;
  userPlayed: number;
  creator: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  autoSendResults: boolean;
}

const MockTestSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  shareCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  public: { type: Boolean, default: false },
  tag: { type: String, default: 'TCS' },
  userPlayed: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  creator: { type: String, default: 'Anonymous' },
  autoSendResults: { type: Boolean, default: true },
});

const MockTest= mongoose.models.MockTest || mongoose.model<IMockTest>('MockTest', MockTestSchema);
export default MockTest;