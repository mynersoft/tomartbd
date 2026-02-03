import { Types } from "mongoose";

/* --------------------------
   Category Type
-------------------------- */
export type CategoryHierarchy = 'category' | 'subcategory' | 'sub-subcategory';

export interface ICategory {
  _id?: Types.ObjectId;

  name: string;
  slug: string;
  icon?: string;
  isActive?: boolean;
  hierarchy?: CategoryHierarchy;

  createdAt?: Date;
  updatedAt?: Date;
}

/* --------------------------
   SubCategory Type
-------------------------- */
export interface ISubCategory {
  _id?: Types.ObjectId;

  name: string;
  slug: string;
  parentCategory: Types.ObjectId; // Ref: Category
  level?: number;
  parentSubCategory?: string | null;
  path: string;
  isActive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}