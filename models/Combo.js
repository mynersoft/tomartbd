// models/Combo.js
import mongoose from 'mongoose';

const comboSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
      },
    ],

    totalRegularPrice: Number,
    comboPrice: { type: Number, required: true },
    discountPercent: Number,
    discountAmount: Number,
    featuredImage: { url: String, publicId: String },
    galleryImages: {
      type: Array,
    },
    isActive: { type: Boolean, default: true },
    tags: {
      type: Array,
    },
    sold: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Combo || mongoose.model('Combo', comboSchema);
