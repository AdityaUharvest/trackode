import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        const connected=await mongoose.connect(process.env.MONGO_URI||'',{});
        if(connected){
            console.log('connected successfully');
        }

    } catch (error) {
        console.log('error in connecting to db');
        console.log(`error:${error}`);
    }
}
export default connectDB;
// this will be called when ever we need to connect db