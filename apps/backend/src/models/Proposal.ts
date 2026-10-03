import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IProposal extends Document {
  project: mongoose.Types.ObjectId;
  photographer: mongoose.Types.ObjectId;
  price: number;
  estimatedDeliveryTime: string;
  numberOfShots: number;
  includedServices: string[];
  additionalServices: string[];
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    photographer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true, min: 0 },
    estimatedDeliveryTime: { type: String, required: true },
    numberOfShots: { type: Number, required: true, min: 1 },
    includedServices: [{ type: String }],
    additionalServices: [{ type: String }],
    message: { type: String },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' }
  },
  { timestamps: true }
);

proposalSchema.index({ project: 1, photographer: 1 }, { unique: true });

export const Proposal: Model<IProposal> = mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', proposalSchema);
