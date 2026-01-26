import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'],
      default: 'user',
    },
    // ✅ Correct: Only ONE address field as AddressSchema
    address: {
      area: { type: String, trim: true },
      thana: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
    shopName: String,
    shopAddress: String,
    bankAccount: String,
    bankName: String,
    bankBranch: String,
    avatar: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);
export default User;
