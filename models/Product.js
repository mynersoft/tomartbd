import mongoose from 'mongoose';

/* ---------- Variant Schema ---------- */
const VariantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: Number,
    },

    images: [String],
  },
  { _id: false }
);

/* ---------- Product Schema ---------- */
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

    // ✅ Base price (must)
    regularPrice: {
      type: Number,
    },

    // ✅ Calculated price
    salePrice: {
      type: Number,
    },

    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: Number,
    },

    brand: String,
    category: String,
    sold: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },

    variants: [VariantSchema],

    description: String,

    images: [String],

    type: {
      type: String,
      enum: ['featured', 'new', 'best-selling', 'regular'],
      default: 'regular',
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    keywords: [String],

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    strict: true, // 🔒 blocks unknown fields
  }
);

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);
