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
        url: String,
        alt: String,
        caption: String,
      },
    ],

    /* ---------- SEO ENHANCEMENTS ---------- */
    seo: {
      metaTitle: {
        type: String,
        maxlength: 60,
        trim: true,
      },
      metaDescription: {
        type: String,
        maxlength: 160,
        trim: true,
      },
      keywords: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
      canonicalUrl: {
        type: String,
        trim: true,
      },
      ogTitle: {
        type: String,
        trim: true,
      },
      ogDescription: {
        type: String,
        trim: true,
      },
      ogImage: {
        type: String,
        trim: true,
      },
      twitterTitle: {
        type: String,
        trim: true,
      },
      twitterDescription: {
        type: String,
        trim: true,
      },
      twitterImage: {
        type: String,
        trim: true,
      },
    },

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
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      avatar: {
        type: String,
        trim: true,
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
      default: 0,
    },

    publishedAt: {
      type: Date,
      index: true,
    },

    /* ---------- SEO FRIENDLY FIELDS ---------- */
    lastModifiedAt: {
      type: Date,
      default: Date.now,
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    /* ---------- RELATED POSTS ---------- */
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full URL
BlogSchema.virtual('fullUrl').get(function() {
  return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${this.slug}`;
});

// SEO optimization: Index for search
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text', 'seo.keywords': 'text' });

// Compound indexes for better query performance
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, publishedAt: -1 });
BlogSchema.index({ isFeatured: 1, publishedAt: -1 });
BlogSchema.index({ 'author.id': 1, publishedAt: -1 });

// Pre-save middleware for SEO optimization
BlogSchema.pre('save', function(next) {
  // Auto-generate meta fields if not provided
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 60);
  }
  
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt 
      ? this.excerpt.substring(0, 160)
      : this.content.substring(0, 160).replace(/<[^>]*>?/gm, '');
  }
  
  // Auto-generate OG fields
  if (!this.seo.ogTitle) {
    this.seo.ogTitle = this.seo.metaTitle;
  }
  
  if (!this.seo.ogDescription) {
    this.seo.ogDescription = this.seo.metaDescription;
  }
  
  if (!this.seo.ogImage) {
    this.seo.ogImage = this.coverImage;
  }
  
  // Auto-generate Twitter fields
  if (!this.seo.twitterTitle) {
    this.seo.twitterTitle = this.seo.metaTitle;
  }
  
  if (!this.seo.twitterDescription) {
    this.seo.twitterDescription = this.seo.metaDescription;
  }
  
  if (!this.seo.twitterImage) {
    this.seo.twitterImage = this.coverImage;
  }
  
  // Set canonical URL
  if (!this.seo.canonicalUrl) {
    this.seo.canonicalUrl = this.fullUrl;
  }
  
  // Calculate word count
  const cleanContent = this.content.replace(/<[^>]*>?/gm, '');
  this.wordCount = cleanContent.split(/\s+/).length;
  
  // Set publishedAt if status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Static method for SEO-friendly find
BlogSchema.statics.findBySlug = async function(slug) {
  return this.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author.id', 'name email avatar');
};

// Static method for finding related posts
BlogSchema.statics.findRelated = async function(blogId, limit = 3) {
  const currentBlog = await this.findById(blogId);
  
  if (!currentBlog) return [];
  
  return this.find({
    _id: { $ne: blogId },
    status: 'published',
    $or: [
      { category: currentBlog.category },
      { tags: { $in: currentBlog.tags } }
    ]
  })
  .sort({ publishedAt: -1, views: -1 })
  .limit(limit)
  .select('title slug excerpt coverImage publishedAt readTime');
};

/* 🔥 MUST for Next.js / Vercel */
export default mongoose.models?.Blog || mongoose.model("Blog", BlogSchema);