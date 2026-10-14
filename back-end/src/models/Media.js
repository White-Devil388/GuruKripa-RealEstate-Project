import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
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
    category: {
      type: String,
      default: 'Project Images'
    },
    type: {
      type: String,
      default: 'image'
    },
    url: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
