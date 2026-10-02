import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendOTPEmail = async (email, otp, userName = 'Candidate') => {
  const gmailUser = process.env.GMAIL_USER || 'anilrongali323@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD || 'vieuisuwukxacany';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 26px; font-weight: bold; margin: 0; color: #ffffff;">Acharya®</h1>
        <p style="font-size: 13px; color: #a1a1aa; margin-top: 5px;">Personalized Career Advisor & Assessment Portal</p>
      </div>
      <div style="background-color: #18181b; padding: 20px; border-radius: 10px; border: 1px solid #3f3f46; text-align: center;">
        <p style="font-size: 15px; margin-bottom: 10px; color: #e4e4e7;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; color: #a1a1aa; margin-bottom: 20px;">Your 6-digit Gmail verification code for Acharya account registration is:</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; background-color: #000000; color: #ffffff; padding: 15px 25px; border-radius: 8px; display: inline-block; border: 1px solid #52525b;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #71717a; margin-top: 20px;">This OTP will expire in 5 minutes. If you did not request this, please ignore this email.</p>
      </div>
      <p style="font-size: 11px; text-align: center; color: #52525b; margin-top: 20px;">© 2026 Acharya® Adaptive Response Interface Agent.</p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"Acharya® Verification" <${gmailUser}>`,
      to: email,
      subject: `🔑 ${otp} is your Acharya® Gmail Verification Code`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`  ➜  Gmail OTP email successfully sent to ${email}`);
    return { success: true, mode: 'smtp' };
  } catch (err) {
    console.error(`  ➜  Nodemailer SMTP Error:`, err.message);
    return { success: false, error: err.message };
  }
};
