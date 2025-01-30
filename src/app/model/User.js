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
    facebook:{
        type: String,
    },
    instagram:{
        type: String,
    },
    geeksforgeeks:{
        type: String,
    },
    codeforces:{
        type: String,
    },
    codechef:{
        type: String,
    },
    hackerrank:{
        type: String,
    },
    hackerearth:{
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
        required:true,
    }
});
const User = mongoose.models.User || mongoose.model("User", user);
export default User;
// so we have created the model for the user