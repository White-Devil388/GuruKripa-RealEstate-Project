import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      default: 'Not Provided'
    },
    email: {
      type: String,
      default: 'Not Provided'
    },
    type: {
      type: String,
      default: 'General Enquiry'
    },
    projectName: {
      type: String,
      default: 'General / Unspecified'
    },
    preferredDate: {
      type: String,
      default: 'N/A'
    },
    preferredTime: {
      type: String,
      default: 'N/A'
    },
    status: {
      type: String,
      default: 'New'
    },
    notes: {
      type: String,
      default: 'Submitted via website form'
    },
    message: {
      type: String,
      default: ''
    },
    dateSubmitted: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead;
