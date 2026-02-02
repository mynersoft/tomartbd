import { Types } from "mongoose";

/* --------------------------
   Cart Product Type
-------------------------- */
export interface ICartProduct {
  product: Types.ObjectId; // Ref: Product
  quantity?: number;       // default: 1
}

/* --------------------------
   Cart Type
-------------------------- */
export interface ICart {
  _id?: Types.ObjectId;

  user: Types.ObjectId;           // Ref: User
  products: ICartProduct[];

  createdAt?: Date;
  updatedAt?: Date;
}