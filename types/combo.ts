import { Types } from 'mongoose';

export interface IComboProduct {
  productId: Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICombo {
  _id?: string;
  name: string;
  slug: string;
  regularPrice: number;
  comboPrice: number;
  discountPercent: number;
  discountAmount: number;
  brand?: Types.ObjectId | string;
  category?: Types.ObjectId | string;
  vendor?: Types.ObjectId | string;
  sold: number;
  stock: number;
  products: IComboProduct[];
  description?: string;
  featureImg?: string;
  galleryImages: string[];
  type: 'featured' | 'new' | 'best-selling' | 'regular';
  rating: number;
  freeDelivery: boolean;
  questions?: Types.ObjectId[] | string[];
  reviews?: Types.ObjectId[] | string[];
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductType = 'featured' | 'new' | 'best-selling' | 'regular';