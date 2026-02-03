import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types/user";

interface UserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
    address: {
      area: { type: String, trim: true },
      thana: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
    shopName: String,
    shopAddress: String,
    bankAccount: String,
    bankName: String,
    bankBranch: String,
    avatar: String,
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
  },
  { timestamps: true }
);

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;