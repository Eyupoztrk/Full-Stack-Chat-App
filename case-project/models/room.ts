import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  isPrivate: boolean;
}

const RoomSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    isPrivate: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

