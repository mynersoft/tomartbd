// types/user.ts
import mongoose, { Types } from "mongoose";


export interface CartItem {
	product: Types.ObjectId;
	quantity: number;
}


export interface IUser {
	id: string;
	name: string;
	email: string;
	password?: string;
	role?: "user" | "admin" | "seller";
	wishlist: Types.ObjectId[]; //
	cart: CartItem[];
}


