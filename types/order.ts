import { Types } from "mongoose";
import {IUser} from "@/types/user";

/* -------- Order Item -------- */
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}


/* -------- Shipping -------- */
export interface ShippingAddress {
  thana?: string;
  area?: string;
  city?: string;
  phone?: string;
}

/* -------- Payment -------- */
export type PaymentStatus = "unpaid" | "paid" | "failed";

export interface PaymentInfo {
  method: string; // COD, SSL, Stripe etc
  status: PaymentStatus;
  transactionId?: string;
}

/* -------- Order Status -------- */
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/* -------- Main Order -------- */
export interface Order {
  _id?: string;

  invoiceNo: string;
  userId?: Types.ObjectId | string;

  customer: IUser;

  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;

  status: OrderStatus;

  payment: PaymentInfo;

  shippingAddress: ShippingAddress;

  orderItems: OrderItem[];

  createdAt?: Date;
  updatedAt?: Date;
}