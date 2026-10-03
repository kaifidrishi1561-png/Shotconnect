import mongoose, { Schema, type Model, type Document } from 'mongoose';
import type { UserRole, UserStatus } from '../types';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['BRAND', 'PHOTOGRAPHER', 'STYLIST', 'ADMIN'], required: true },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED', 'PENDING'], default: 'PENDING' },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { type: String },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    refreshToken: { type: String }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });
userSchema.index({ location: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
