import { Types } from 'mongoose';

/* --------------------------
   SEO Types
-------------------------- */
export interface ISEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

/* --------------------------
   Author Type
-------------------------- */
export interface IAuthor {
  id?: Types.ObjectId; // Ref: User
  name: string;
  avatar?: string;
}

/* --------------------------
   Image Type
-------------------------- */
export interface IBlogImage {
  url: string;
  alt?: string;
  caption?: string;
}

/* --------------------------
   Blog Status
-------------------------- */
export type BlogStatus = 'draft' | 'published' | 'archived';

/* --------------------------
   Blog Type
-------------------------- */
export interface IBlog {
  _id?: Types.ObjectId;

  title: string;
  slug: string;
  content: string;
  excerpt?: string;

  coverImage?: string;
  images?: IBlogImage[];

  /* ---------- SEO ---------- */
  seo?: ISEO;

  /* ---------- Taxonomy ---------- */
  category?: string;
  tags?: string[];

  /* ---------- Status ---------- */
  status?: BlogStatus;
  isFeatured?: boolean;

  /* ---------- Author ---------- */
  author: IAuthor;

  /* ---------- Stats ---------- */
  views?: number;
  likes?: number;
  readTime?: number; // minutes
  wordCount?: number;

  publishedAt?: Date;
  lastModifiedAt?: Date;

  /* ---------- Related Posts ---------- */
  relatedPosts?: Types.ObjectId[];

  /* ---------- Timestamps ---------- */
  createdAt?: Date;
  updatedAt?: Date;

  /* ---------- Virtuals ---------- */
  fullUrl?: string;
}
}