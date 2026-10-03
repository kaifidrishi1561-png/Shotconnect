import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IInvoice extends Document {
  project: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  photographer: mongoose.Types.ObjectId;
  total: number;
  commission: number;
  payout: number;
  status: 'PAID' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photographer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    total: { type: Number, required: true, min: 0 },
    commission: { type: Number, required: true, min: 0 },
    payout: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PAID', 'PENDING'], default: 'PENDING' }
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);
