import mongoose, { Schema, type Model, type Document } from 'mongoose';
import type { PaymentStatus } from '../types';

export interface IPayment extends Document {
  project: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  photographer: mongoose.Types.ObjectId;
  amount: number;
  platformFee: number;
  photographerPayout: number;
  stripePaymentIntentId?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photographer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, default: 0 },
    photographerPayout: { type: Number, default: 0 },
    stripePaymentIntentId: { type: String },
    status: { type: String, enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'], default: 'PENDING' }
  },
  { timestamps: true }
);

paymentSchema.index({ project: 1, stripePaymentIntentId: 1 });

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
