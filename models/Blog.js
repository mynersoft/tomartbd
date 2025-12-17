import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    /* ================= BASIC ================= */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String, // short description
      maxlength: 300,
    },

    /* ================= MEDIA ================= */
    coverImage: {
      type: String, // Cloudinary / URL
    },

    images: [
      {
        type: String,
      },
    ],

    /* ================= SEO ================= */
    metaTitle: {
      type: String,
      maxlength: 60,
    },

    metaDescription: {
      type: String,
      maxlength: 160,
    },

    keywords: [
      {
        type: String,
      },
    ],

    /* ================= BLOG INFO ================= */
    category: {
      type: String,
      index: true,
    },

    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    /* ================= AUTHOR ================= */
    author: {
      name: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    /* ================= ANALYTICS ================= */
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number, // in minutes
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ================= INDEXES ================= */
BlogSchema.index({ title: "text", content: "text" });

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);