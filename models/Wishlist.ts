import mongoose, { Schema, Document, Model } from "mongoose";
import { IWishlist } from "@/types/wishlist";

interface WishlistDocument extends Omit<IWishlist, "_id">, Document {}

const WishlistSchema = new Schema<WishlistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Wishlist: Model<WishlistDocument> =
  mongoose.models.Wishlist ||
  mongoose.model<WishlistDocument>("Wishlist", WishlistSchema);

export default Wishlist;