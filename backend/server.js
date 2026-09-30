import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acharya_career_portal';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Acharya MERN Backend Server Running', timestamp: new Date() });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`\n======================================================`);
    console.log(`🍃 [MONGODB CONNECTED] URI: ${MONGODB_URI}`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.warn(`\n⚠️ [MONGODB CONNECTION WARNING]: ${error.message}`);
    console.warn(`Backend will continue running API services with memory fallback.\n`);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [ACHARYA BACKEND RUNNING] http://localhost:${PORT}`);
    console.log(`📧 Gmail OTP API: http://localhost:${PORT}/api/auth/send-otp`);
  });
});
