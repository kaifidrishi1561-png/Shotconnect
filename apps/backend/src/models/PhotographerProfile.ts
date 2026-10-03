import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IPhotographerProfile extends Document {
  user: mongoose.Types.ObjectId;
  bio?: string;
  location?: string;
  experience?: number;
  specializations?: string[];
  equipment?: string[];
  photographyStyles?: string[];
  pricing?: { basePackage: number; perShot?: number; videoRate?: number };
  availability?: string[];
  portfolioCount?: number;
  averageRating?: number;
  totalProjects?: number;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const photographerProfileSchema = new Schema<IPhotographerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String },
    location: { type: String },
    experience: { type: Number, min: 0 },
    specializations: [{ type: String }],
    equipment: [{ type: String }],
    photographyStyles: [{ type: String }],
    pricing: {
      basePackage: { type: Number, default: 0 },
      perShot: { type: Number, default: 0 },
      videoRate: { type: Number, default: 0 }
    },
    availability: [{ type: String }],
    portfolioCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

photographerProfileSchema.index({ location: 1, experience: -1, averageRating: -1 });

export const PhotographerProfile: Model<IPhotographerProfile> = mongoose.models.PhotographerProfile || mongoose.model<IPhotographerProfile>('PhotographerProfile', photographerProfileSchema);
