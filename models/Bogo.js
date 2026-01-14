import mongoose from 'mongoose';

/* ---------- Product Schema ---------- */

const BogoSchema = new mongoose.Schema(
  {
    buyQty: {
      type: Number,
      default: 1, // For BOGO, typically buy 1 get 1 free
    },
    getQty: {
      type: Number,
      default: 1, // For BOGO, get 1 free
    },
    featureImage: {
      type: String,
    },
    price: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    mainItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    freeItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    // Optional: If you want BOGO on the same product or different
    sameProductOnly: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    strict: true, // 🔒 blocks unknown fields
  }
);

export default mongoose.models.Bogo || mongoose.model('Bogo', BogoSchema);
