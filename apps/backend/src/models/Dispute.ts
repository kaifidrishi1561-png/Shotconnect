import mongoose, { Schema, type Model, type Document } from 'mongoose';
import type { DisputeStatus } from '../types';

export interface IDispute extends Document {
  project: mongoose.Types.ObjectId;
  raisedBy: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  evidence: string[];
  status: DisputeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    evidence: [{ type: String }],
    status: { type: String, enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'], default: 'OPEN' }
  },
  { timestamps: true }
);

export const Dispute: Model<IDispute> = mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', disputeSchema);
