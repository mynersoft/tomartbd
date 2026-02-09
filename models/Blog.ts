import mongoose, { Schema, Model, Types, InferSchemaType, Document } from "mongoose";

/* ---------- IMAGE SCHEMA ---------- */
const ImageSchema = new Schema(
  {
    url: String,
    alt: String,
    caption: String,
  },
  { _id: false }
);

/* ---------- SEO SCHEMA ---------- */
const SeoSchema = new Schema(
  {
    metaTitle: { type: String, maxlength: 60, trim: true },
    metaDescription: { type: String, maxlength: 160, trim: true },
    keywords: [{ type: String, lowercase: true, trim: true }],
    canonicalUrl: { type: String, trim: true },

    ogTitle: String,
    ogDescription: String,
    ogImage: String,

    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
  },
  { _id: false }
);

/* ---------- AUTHOR SCHEMA ---------- */
const AuthorSchema = new Schema(
  {
    name: { type: String, trim: true },
    id: { type: Schema.Types.ObjectId, ref: "User" },
    avatar: String,
  },
  { _id: false }
);

/* ---------- BLOG SCHEMA ---------- */
const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    coverImage: String,
    images: [ImageSchema],
    seo: SeoSchema,
    category: { type: String, lowercase: true, trim: true, index: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    author: AuthorSchema,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    readTime: { type: Number, default: 0 },
    publishedAt: { type: Date, index: true },
    lastModifiedAt: { type: Date, default: Date.now },
    wordCount: { type: Number, default: 0 },
    relatedPosts: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/* ---------- VIRTUAL ---------- */
BlogSchema.virtual("fullUrl").get(function (this: any) {
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${this.slug}`;
});



/* ---------- PRE-SAVE MIDDLEWARE ---------- */


/* ---------- STATICS ---------- */

/* ---------- TYPES ---------- */
export type BlogDocument = InferSchemaType<typeof BlogSchema> & Document;

/* ---------- EXPORT ---------- */
export default (mongoose.models.Blog) ||
  mongoose.model<BlogDocument>("Blog", BlogSchema);