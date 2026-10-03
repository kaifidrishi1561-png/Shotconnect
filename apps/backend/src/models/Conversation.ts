import mongoose, { Schema, type Model, type Document } from 'mongoose';

export interface IConversation extends Document {
  project?: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true }
);

conversationSchema.index({ project: 1, participants: 1 });

export const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);
