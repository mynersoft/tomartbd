import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true },
    brand: String,
    category: String,
    stock: { type: Number, default: 0 }, // default stock
    description: String,
    images: [String],

    // ✅ Product type enum
    type: {
      type: String,
      enum: ["featured", "new", "best-selling", "regular"],
      default: "regular",
    },

    // ✅ Rating
    rating: { type: Number, default: 0 }, // average rating
    reviewsCount: { type: Number, default: 0 }, // number of reviews

    // ✅ Flags for special display
    isActive: { type: Boolean, default: true }, // active / inactive
    isOnSale: { type: Boolean, default: false },
    salePrice: { type: Number }, // optional sale price

    // ✅ SEO-friendly fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [String],

    // ✅ Optional for inventory tracking
    sku: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);