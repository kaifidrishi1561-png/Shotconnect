import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IBooking extends Document {
  brand: mongoose.Types.ObjectId;
  photographer: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  location: string;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    brand: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photographer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' }
  },
  { timestamps: true }
);

bookingSchema.index({ photographer: 1, date: 1, time: 1 }, { unique: false });

export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
