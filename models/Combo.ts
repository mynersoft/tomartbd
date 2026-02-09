import mongoose, { Schema, Model, Document } from "mongoose";
import { ICombo, IComboProduct, ProductType } from "@/types/combo";

interface ComboProductDocument extends IComboProduct, Document {}
interface ComboDocument extends Omit<ICombo, "_id">, Document {}

const ComboProductSchema = new Schema<ComboProductDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String,
  },
  { _id: false }
);

const ComboSchema = new Schema<ComboDocument>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, unique: true, required: true, index: true },

    regularPrice: Number,
    comboPrice: { type: Number, required: true },

    discountPercent: Number,
    discountAmount: Number,

    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    vendor: { type: Schema.Types.ObjectId, ref: "User" },

    sold: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    products: { type: [ComboProductSchema], default: [] },

    description: String,
    featureImg: String,
    galleryImages: { type: [String], default: [] },

    type: { type: String, enum: ["featured", "new", "best-selling", "regular"], default: "regular" },

    rating: { type: Number, default: 0 },
    freeDelivery: { type: Boolean, default: false },

    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    isActive: { type: Boolean, default: true },

    metaTitle: String,
    metaDescription: String,
    keywords: { type: [String], default: [] },

    sku: { type: String, unique: true, sparse: true },

  },
  { timestamps: true, strict: true }
);

const Combo: Model<ComboDocument> =
  mongoose.models.Combo || mongoose.model<ComboDocument>("Combo", ComboSchema);

export default Combo;