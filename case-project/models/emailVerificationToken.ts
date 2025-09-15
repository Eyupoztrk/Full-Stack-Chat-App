import mongoose, { Schema, Document } from 'mongoose';

export interface IVerificationToken extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const VerificationTokenSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    'VerificationToken',
    VerificationTokenSchema
  );