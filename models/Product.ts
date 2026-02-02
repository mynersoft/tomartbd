import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IProduct, IVariant } from '@/types/product';

/* =====================
   Document Type
===================== */

export interface IProductDocument extends IProduct, Document {}

/* =====================
   Variant Schema
===================== */

const VariantSchema = new Schema<IVariant>(
  {
    size: String,
    color: String,
    price: Number,
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
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    images: [String],
  },
  { _id: false }
);

/* =====================
   Product Schema
===================== */

const ProductSchema = new Schema<IProductDocument>(
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

    regularPrice: Number,
    salePrice: Number,

    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: Number,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

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

    featureImg: String,
    galleryImages: [String],

    type: {
      type: String,
      enum: ['featured', 'new', 'best-selling', 'regular'],
      default: 'regular',
    },

    rating: {
      type: Number,
      default: 0,
    },

    freeDelivery: {
      type: Boolean,
      default: false,
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

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
    strict: true,
  }
);

/* =====================
   Model Export
===================== */

const Product: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;