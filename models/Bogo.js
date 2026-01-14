// models/Bogo.js
import mongoose from 'mongoose';

const BogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    featureImage: {
      type: String,
      required: true,
    },

    mainItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    freeItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    buyQty: {
      type: Number,
      default: 1, // Buy 1
    },

    getQty: {
      type: Number,
      default: 1, // Get 1 Free
    },

    sameProductOnly: {
      type: Boolean,
      default: true, // Buy X Get X
    },

    startDate: Date,
    endDate: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Bogo || mongoose.model('Bogo', BogoSchema);