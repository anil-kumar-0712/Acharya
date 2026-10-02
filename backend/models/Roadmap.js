import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
  },
  targetDomain: {
    type: String,
    required: true,
  },
  userLevel: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  estimatedTimeline: {
    type: String,
    required: true,
  },
  expectedSalary: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  steps: [{
    phase: String,
    title: String,
    duration: String,
    description: String,
    keySkills: [String],
    recommendedResources: [String],
    projectMilestone: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'roadmaps' });

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
