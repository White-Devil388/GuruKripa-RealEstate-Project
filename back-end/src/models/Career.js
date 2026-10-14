import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      default: 'Engineering & Construction'
    },
    location: {
      type: String,
      default: 'Gurugram HQ'
    },
    type: {
      type: String,
      default: 'Full-Time'
    },
    experience: {
      type: String,
      default: '0 - 2 Years'
    },
    summary: {
      type: String,
      default: ''
    },
    responsibilities: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    qualifications: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    benefits: {
      type: [String],
      default: []
    },
    salaryStipend: {
      type: String,
      default: 'Competitive Industry Standards'
    },
    status: {
      type: String,
      default: 'Open'
    }
  },
  {
    timestamps: true
  }
);

const Career = mongoose.models.Career || mongoose.model('Career', careerSchema);

export default Career;
