import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IAvailability extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  slots: string[];
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySchema = new Schema<IAvailability>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    slots: [{ type: String }],
    isBooked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

availabilitySchema.index({ user: 1, date: 1 }, { unique: true });

export const Availability: Model<IAvailability> = mongoose.models.Availability || mongoose.model<IAvailability>('Availability', availabilitySchema);
