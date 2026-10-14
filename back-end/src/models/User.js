import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    kycType: { type: String, required: true, trim: true, uppercase: true },
    kycNumber: { type: String, required: true, trim: true, uppercase: true },
    role: { type: String, enum: ['user', 'subadmin', 'admin'], default: 'user', index: true }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
