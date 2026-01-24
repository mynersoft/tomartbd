import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    parentSubCategory: {
      type: String,
      default: null
    },
    path: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    icon: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hierarchy: {
      type: String,
      enum: ['category', 'subcategory', 'sub-subcategory'],
      default: 'category'
    }
  },
  { timestamps: true }
);

// Create indexes
subCategorySchema.index({ parentCategory: 1 });
subCategorySchema.index({ parentSubCategory: 1 });
subCategorySchema.index({ path: 1 });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);

export { Category, SubCategory };