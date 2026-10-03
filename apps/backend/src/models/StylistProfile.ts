import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IStylistProfile extends Document {
  user: mongoose.Types.ObjectId;
  bio?: string;
  location?: string;
  stylingCategories?: string[];
  pricing?: { sessionRate?: number; packageRate?: number };
  availability?: string[];
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stylistProfileSchema = new Schema<IStylistProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String },
    location: { type: String },
    stylingCategories: [{ type: String }],
    pricing: {
      sessionRate: { type: Number, default: 0 },
      packageRate: { type: Number, default: 0 }
    },
    availability: [{ type: String }],
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const StylistProfile: Model<IStylistProfile> = mongoose.models.StylistProfile || mongoose.model<IStylistProfile>('StylistProfile', stylistProfileSchema);
