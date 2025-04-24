import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import OtpStorage from "@/app/model/OtpStorage"
// In a production environment, you should use a database to store these values
import User from "@/app/model/User"
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "google.com",
  service: process.env.EMAIL_SERVICE || 'gmail',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.OTP_EMAIL_USER,
    pass: process.env.OTP_EMAIL_PASSWORD,
  },
});

async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.OTP_EMAIL_USER,
    to: email,
    subject: 'Your Verification Code for Trackode',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for signing up for Trackode. Please use the following code to verify your email address:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 32px; margin: 0; color: #007bff;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>Best regards,<br />The Trackode Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, purpose } = body;
    // some validation for the email and purpose
    if (!email || typeof email !== 'string' || !email.match(/^\S+@\S+\.\S+$/)) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
       
      );
    }
    
    const user = await User.findOne(
      { email: email } 
    )
    // now we have the user 

    // from here using purpose we can check either the user is new or existing
    if (purpose === 'password_reset') {
    
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User does not exist' },
        );
      }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingOtpData = await OtpStorage.findOne(
      { email }
    );
    if (existingOtpData) {
      // If OTP already exists, update it
      existingOtpData.otp = otp;
      existingOtpData.createdAt = Date.now(); // Update the timestamp
      await existingOtpData.save();
    } else {
      // If OTP does not exist, create a new one
      const otpData = new OtpStorage({
        email,
        otp,
        createdAt: Date.now(),
      });
      await otpData.save();
    }
    
    await sendOTPEmail(email, otp);
    // so we have sent the otp to the user email
    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    }


    // handling signup purpose
    else{
      if (user) {
        return NextResponse.json(
          { success: false, message: 'User already exists' },
          
        );
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const existingOtpData = await OtpStorage.findOne(
        { email }
      );
      if (existingOtpData) {
        // If OTP already exists, update it
        existingOtpData.otp = otp;
        existingOtpData.createdAt = Date.now(); // Update the timestamp
        await existingOtpData.save();
      } else {
        // If OTP does not exist, create a new one
        const otpData = new OtpStorage({
          email,
          otp,
          createdAt: Date.now(),
        });
        await otpData.save();
      }
      
      await sendOTPEmail(email, otp);
      return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    }
    
    

    
   

   
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'OTP already sent ! Failed to send OTP',error: error},
    
    );
  }
}