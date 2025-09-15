import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  senderId: mongoose.Schema.Types.ObjectId;
  roomId: mongoose.Schema.Types.ObjectId;
}

const MessageSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room', 
      required: true,
    },
  },
  {
   
    timestamps: { createdAt: true, updatedAt: false }, 
  }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

