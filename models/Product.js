import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
    },

    brand: String,
    category: String,

    stock: {
      type: Number,
      default: 0,
    },

    description: String,

    images: [
      {
        type: String,
      },
    ],

    // ✅ Product type
    type: {
      type: String,
      enum: ["featured", "new", "best-selling", "regular"],
      default: "regular",
    },

    // ✅ Rating (cached value)
    rating: {
      type: Number,
      default: 0,
    },

    // ✅ Relations (IMPORTANT FIX)
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    // ✅ Flags
    isActive: {
      type: Boolean,
      default: true,
    },

    isOnSale: {
      type: Boolean,
      default: false,
    },

    salePrice: {
      type: Number,
    },

    // ✅ SEO
    metaTitle: String,
    metaDescription: String,
    keywords: [String],

    // ✅ Inventory
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);