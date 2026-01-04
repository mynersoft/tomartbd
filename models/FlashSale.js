import mongoose from "mongoose";

const FlashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  banner: String,

  startAt: {
    type: Date,
    required: true,
  },
  endAt: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["upcoming", "active", "ended"],
    default: "upcoming",
  },

  priority: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

export default mongoose.model("FlashSale", FlashSaleSchema);