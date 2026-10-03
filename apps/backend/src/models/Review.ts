import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IReview extends Document {
  project: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  targetUser: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

reviewSchema.index({ project: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ targetUser: 1, rating: -1 });

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
