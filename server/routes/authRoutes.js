import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'acharya_jwt_secret_2026';

// 1. Send OTP to Email
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'An account with this email already exists. Please login instead.' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear previous OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Store OTP in MongoDB
    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
    });

    // Send email via Nodemailer
    const emailResult = await sendOTPEmail(email, otpCode, name);

    return res.status(200).json({
      message: 'Verification OTP sent successfully to email.',
      devOtp: emailResult.devOtp || undefined,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: 'Internal server error sending OTP' });
  }
});

// 2. Verify OTP & Complete Registration
router.post('/register', async (req, res) => {
  try {
    const { name, age, email, password, targetDomain, otp } = req.body;

    if (!name || !age || !email || !password || !targetDomain || !otp) {
      return res.status(400).json({ error: 'All fields including OTP verification code are required' });
    }

    // Verify OTP from MongoDB
    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP verification code. Please request a new one.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create or update user in MongoDB
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.name = name;
      user.age = age;
      user.password = hashedPassword;
      user.targetDomain = targetDomain;
      user.isVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name,
        age,
        email: email.toLowerCase(),
        password: hashedPassword,
        targetDomain,
        isVerified: true,
      });
    }

    // Delete used OTP
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account registered and verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        targetDomain: user.targetDomain,
        isVerified: user.isVerified,
        isTestCompleted: user.isTestCompleted,
        score: user.score,
        level: user.level,
        roadmap: user.roadmap,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// 3. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Account not found. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        targetDomain: user.targetDomain,
        isVerified: user.isVerified,
        isTestCompleted: user.isTestCompleted,
        score: user.score,
        level: user.level,
        roadmap: user.roadmap,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// 4. Save Score & Roadmap to MongoDB
router.post('/save-roadmap', async (req, res) => {
  try {
    const { email, score, level, roadmap } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    user.score = score;
    user.level = level;
    user.isTestCompleted = true;
    user.roadmap = roadmap;
    await user.save();

    return res.status(200).json({
      message: 'Score and personalized roadmap saved to MongoDB successfully!',
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        targetDomain: user.targetDomain,
        isTestCompleted: user.isTestCompleted,
        score: user.score,
        level: user.level,
        roadmap: user.roadmap,
      },
    });
  } catch (error) {
    console.error('Save Roadmap Error:', error);
    return res.status(500).json({ error: 'Failed to save roadmap to database' });
  }
});

export default router;
