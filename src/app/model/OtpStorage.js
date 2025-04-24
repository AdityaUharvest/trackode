import mongoose from "mongoose";
//otp storage schema
const otpStorageSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '10m'
        }
    },
    { timestamps: true }
);
const OtpStorage = mongoose.models.OtpStorage || mongoose.model("OtpStorage", otpStorageSchema);
export default OtpStorage;