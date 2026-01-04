import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed","free-shipping"],
      default: "percentage",
    },

    value: {
      type: Number,
      required: true,
    },

    minPurchase: {
      type: Number,
      default: 0,
    },

    usageLimit: {
      type: Number,
      default: null, 
    },

    customerLimit: {
      type: Number,
      default: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Voucher ||
  mongoose.model("Voucher", VoucherSchema);