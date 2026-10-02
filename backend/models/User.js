import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  targetDomain: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isTestCompleted: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    default: '',
  },
  roadmap: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'users' });

export const User = mongoose.model('User', userSchema);
