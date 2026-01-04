import mongoose from "mongoose";

const FlashSaleProductSchema = new mongoose.Schema({
  flashSaleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlashSale",
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  flashPrice: {
    type: Number,
    required: true,
  },

  flashStock: {
    type: Number,
    required: true,
  },

  soldQty: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("FlashSaleProduct", FlashSaleProductSchema);