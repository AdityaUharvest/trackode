import mongoose,  { Document ,Schema} from 'mongoose';
export interface User extends Document {
    name: string;
    email: string;
    profession:string;
    linkedin:string;
    github:string;
    leetcode:string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
const UserSchema: Schema<User> = new Schema({
    name: { type: String, required: true },
    email: { type: String, match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please use valid email"],    required: [true,"Email is required"] ,unique:true },
    profession: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    leetcode: { type: String, required: true },
    password: { type: String, required:[true,"Password is required"] ,unique:true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<User>('User', UserSchema);