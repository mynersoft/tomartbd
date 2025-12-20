import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema(
  {
    // Voucher Code
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Voucher Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Discount Type
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    // Discount Value
    value: {
      type: Number,
      required: true,
      min: 1,
    },

    // Minimum Purchase Amount
    minPurchase: {
      type: Number,
      default: 0,
    },

    // Total Usage Limit (null = unlimited)
    usageLimit: {
      type: Number,
      default: null,
    },

    // Per Customer Usage Limit
    customerLimit: {
      type: Number,
      default: 1,
    },

    // Start Date
    startDate: {
      type: Date,
      required: true,
    },

    // End Date
    endDate: {
      type: Date,
      required: true,
    },

    // Voucher Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Total Used Count
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Voucher ||
  mongoose.model("Voucher", VoucherSchema);