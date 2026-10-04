import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  demandIndex: {
    type: String,
    default: 'Very High',
  },
  averageSalary: {
    type: String,
    required: true,
  },
  coreSkills: [{
    type: String,
  }],
  popularRoles: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'domains' });

export const Domain = mongoose.model('Domain', domainSchema);
