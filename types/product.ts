import { Types } from 'mongoose';

/* =====================
   Shared Types
===================== */

export type DiscountType = 'percentage' | 'fixed';

export interface IDiscount {
  type?: DiscountType;
  value?: number;
}

export interface IVariant {
  size?: string;
  color?: string;
  price?: number;
  stock?: number;
  salePrice?: number;
  discount?: IDiscount;
  startDate?: Date;
  endDate?: Date;
  images?: string[];
}

export type ProductType =
  | 'featured'
  | 'new'
  | 'best-selling'
  | 'regular';

export interface IProduct {
  name: string;
  slug: string;

  regularPrice?: number;
  salePrice?: number;
  discount?: IDiscount;

  brand?: Types.ObjectId;
  category?: Types.ObjectId;
  vendor?: Types.ObjectId;

  sold?: number;
  stock?: number;

  variants?: IVariant[];

  description?: string;

  featureImg?: string;
  galleryImages?: string[];

  type?: ProductType;

  rating?: number;
  freeDelivery?: boolean;

  reviews?: Types.ObjectId[];
  questions?: Types.ObjectId[];

  isActive?: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];

  sku?: string;

  createdAt?: Date;
  updatedAt?: Date;
}