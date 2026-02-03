import { Types } from "mongoose";

export type ProductType = "featured" | "new" | "best-selling" | "regular";

export interface IComboProduct {
  productId: Types.ObjectId;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface ICombo {
  _id?: Types.ObjectId;

  name: string; // Product-style key
  slug?: string;

  regularPrice?: number;
  comboPrice: number; // used instead of salePrice
  discountPercent?: number;
  discountAmount?: number;

  brand?: Types.ObjectId;
  category?: Types.ObjectId;
  vendor?: Types.ObjectId;

  sold?: number;
  stock?: number; // can keep total stock

  products?: IComboProduct[]; // embedded products

  description?: string;
  featureImg?: string;
  galleryImages?: string[];

  type?: ProductType;

  rating?: number; // optional for combos
  freeDelivery?: boolean;

  questions?: Types.ObjectId[]; // ref to Question
  reviews?: Types.ObjectId[]; // ref to Review

  isActive?: boolean;

  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];

  sku?: string; // optional
  createdAt?: Date;
  updatedAt?: Date;
}