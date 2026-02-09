import { Types } from "mongoose";

/* ---------- IMAGE ---------- */
export interface IBlogImage {
  url?: string;
  alt?: string;
  caption?: string;
}

/* ---------- SEO ---------- */
export interface IBlogSEO {
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

/* ---------- AUTHOR ---------- */
export interface IBlogAuthor {
  name: string;
  id?: Types.ObjectId | string;
  avatar?: string;
}

/* ---------- MAIN BLOG ---------- */
export interface IBlog {
  _id?: Types.ObjectId | string;

  title: string;
  slug: string;
  content: string;
  excerpt?: string;

  coverImage?: string;
  images?: IBlogImage[];

  seo?: IBlogSEO;

  category?: string;
  tags?: string[];

  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;

  author: IBlogAuthor;

  views?: number;
  likes?: number;
  readTime?: number;

  publishedAt?: Date;
  lastModifiedAt?: Date;
  wordCount?: number;

  relatedPosts?: (Types.ObjectId | string)[];

  createdAt?: Date;
  updatedAt?: Date;

  /* ---------- VIRTUAL ---------- */
  fullUrl?: string;
}