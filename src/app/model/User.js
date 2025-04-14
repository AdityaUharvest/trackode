import mongoose from "mongoose";
const user = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone:{
        type: String,

    },
    image:{
        type: String,
    },
    name:{
        type: String,
    },
    leetcode:{
        type: String,
    },
    github:{
        type: String,
    },
    linkedin:{
        type: String,
    },
    twitter:{
        type: String,
    },
    
    provider:{
        type: String,
        default:"credentials"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    slug:{
        type:String,
    },
    bio:{
      type:String, 
    },
    dob:{
        type:Date,
    },
    college:{
        type:String,
    },
    branch:{
        type:String,
    },
    year:{
        type:String,
    },
    interests:{
        
        type: [String],

    },
    languages:{
        
        type: [String],
    },
    achievements:{
        type: [String],
    },
    public:{
        type: Boolean,
        default: true,
    },
    followers:{
        type: [String],
    },
    college:{
        type: String,
    },
    branch:{
        type: String,
    },
    year:{
        type: String,
    },
    skills:{
        type: [String],
    },
});
const User = mongoose.models.User || mongoose.model("User", user);
export default User;
// so we have created the model for the user