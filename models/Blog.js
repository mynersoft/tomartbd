import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
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
      type: String,
      maxlength: 300,
    },

    coverImage: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],

    /* ---------- SEO ---------- */
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
        lowercase: true,
        trim: true,
      },
    ],

    /* ---------- TAXONOMY ---------- */
    category: {
      type: String,
      index: true,
      lowercase: true,
      trim: true,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    /* ---------- STATUS ---------- */
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* ---------- AUTHOR ---------- */
    author: {
      name: {
        type: String,
        trim: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    /* ---------- STATS ---------- */
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number, // minutes
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/* 🔥 MUST for Next.js / Vercel */
export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);