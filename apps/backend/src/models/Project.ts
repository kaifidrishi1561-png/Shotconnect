import mongoose, { Schema, type Model, type Document } from 'mongoose';
import type { ProjectStatus } from '../types';

export interface IProject extends Document {
  brand: mongoose.Types.ObjectId;
  title: string;
  category: string;
  productName: string;
  numberOfProducts: number;
  requiredPhotos: number;
  photographyStyle: string;
  backgroundRequirement?: string;
  modelRequired: boolean;
  propsRequired: boolean;
  videoRequired: boolean;
  description?: string;
  referenceImages: string[];
  budget: number;
  location: string;
  deadline: Date;
  additionalInstructions?: string;
  status: ProjectStatus;
  selectedPhotographer?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    brand: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    productName: { type: String, required: true },
    numberOfProducts: { type: Number, required: true, min: 1 },
    requiredPhotos: { type: Number, required: true, min: 1 },
    photographyStyle: { type: String, required: true },
    backgroundRequirement: { type: String },
    modelRequired: { type: Boolean, default: false },
    propsRequired: { type: Boolean, default: false },
    videoRequired: { type: Boolean, default: false },
    description: { type: String },
    referenceImages: [{ type: String }],
    budget: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    deadline: { type: Date, required: true },
    additionalInstructions: { type: String },
    status: { type: String, enum: ['DRAFT', 'OPEN', 'PROPOSALS_RECEIVED', 'PHOTOGRAPHER_SELECTED', 'PAYMENT_PENDING', 'CONFIRMED', 'SHOOTING', 'EDITING', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED'], default: 'OPEN' },
    selectedPhotographer: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

projectSchema.index({ brand: 1, status: 1 });
projectSchema.index({ category: 1, location: 1, budget: 1 });

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
