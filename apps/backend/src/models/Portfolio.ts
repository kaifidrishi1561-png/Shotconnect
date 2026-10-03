import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IPortfolio extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  clientType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true },
    tags: [{ type: String }],
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    clientType: { type: String }
  },
  { timestamps: true }
);

portfolioSchema.index({ user: 1, category: 1 });

export const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
