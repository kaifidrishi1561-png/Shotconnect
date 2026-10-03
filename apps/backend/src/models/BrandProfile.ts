import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IBrandProfile extends Document {
  user: mongoose.Types.ObjectId;
  companyName?: string;
  website?: string;
  brandType?: string;
  marketPlaces?: string[];
  productCategories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const brandProfileSchema = new Schema<IBrandProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, trim: true },
    website: { type: String },
    brandType: { type: String },
    marketPlaces: [{ type: String }],
    productCategories: [{ type: String }]
  },
  { timestamps: true }
);

export const BrandProfile: Model<IBrandProfile> = mongoose.models.BrandProfile || mongoose.model<IBrandProfile>('BrandProfile', brandProfileSchema);
