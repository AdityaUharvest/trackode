import mongoose, { Schema } from 'mongoose';

interface ICertificate {
  type: 'certificate';
  rank: number;
  quizTitle: string;
  quizId: mongoose.Types.ObjectId;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: Date;
}

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  phone?: string;
  image?: string;
  name?: string;
  leetcode?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  slug?: string;
  bio?: string;
  dob?: Date;
  college?: string;
  branch?: string;
  year?: string;
  interests?: string[];
  languages?: string[];
  achievements?: Array<ICertificate | string>;
  public: boolean;
  followers?: string[];
  skills?: string[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  leetcode: {
    type: String,
  },
  github: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  twitter: {
    type: String,
  },
  provider: {
    type: String,
    default: 'credentials',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
  },
  bio: {
    type: String,
  },
  dob: {
    type: Date,
  },
  college: {
    type: String,
  },
  branch: {
    type: String,
  },
  year: {
    type: String,
  },
  interests: {
    type: [String],
  },
  languages: {
    type: [String],
  },
  achievements: {
    type: [{
      type: {
        type: String,
        enum: ['certificate', 'other'],
        default: 'other',
      },
      rank: {
        type: Number,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      quizTitle: {
        type: String,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      quizId: {
        type: Schema.Types.ObjectId,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      score: {
        type: Number,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      totalQuestions: {
        type: Number,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      percentage: {
        type: Number,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      date: {
        type: Date,
        required: function(this: any) { return this.type === 'certificate'; },
      },
      _id: false, // Prevent Mongoose from generating _id for subdocuments
    }],
    default: [],
  },
  public: {
    type: Boolean,
    default: true,
  },
  followers: {
    type: [String],
  },
  skills: {
    type: [String],
  },
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;