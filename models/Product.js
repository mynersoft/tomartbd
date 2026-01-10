import mongoose from 'mongoose';



const VariantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
    },
    color: {
      type: String,
}
    price: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);




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

   regularPrice: {
      type: Number,
      required: true,
    },
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
    sold: Number,

    stock: {
      type: Number,
      default: 0,
    },

variants: [VariantSchema],

    description: String,

    images: [
      {
        type: String,
      },
    ],

    // ✅ Product type
    type: {
      type: String,
      enum: ['featured', 'new', 'best-selling', 'regular'],
      default: 'regular',
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
        ref: 'Review',
      },
    ],

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],

    // ✅ Flags
    isActive: {
      type: Boolean,
      default: true,
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
  mongoose.model('Product', ProductSchema);
