import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },

        email: {
            type: String,
            required: [true, "Eamil is required"],
            unique: true
        },

        password: {
            type: String,
            required: [true, "password is required"]
        },

        emailVerified: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);