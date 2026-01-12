// models/Combo.js
import mongoose from 'mongoose';

const comboSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: String,

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
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

  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,

}, { timestamps: true });

export default mongoose.models.Combo || mongoose.model('Combo', comboSchema);