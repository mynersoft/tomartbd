import { Types } from "mongoose";

export interface IWishlist {
  _id?: Types.ObjectId;

  user: Types.ObjectId;      // User who owns the wishlist
  products?: Types.ObjectId[]; // Array of Product IDs

  createdAt?: Date;
  updatedAt?: Date;
}