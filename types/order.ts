import { Types } from "mongoose";

/* --------------------------
   Payment Type
-------------------------- */
export type PaymentMethod = 'COD' | 'Card' | 'Bkash' | 'Rocket' | string;
export type PaymentStatus = 'unpaid' | 'paid' | 'failed';

export interface IPayment {
  method?: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
}

/* --------------------------
   Customer Type
-------------------------- */
export interface ICustomer {
  name: string;
  email: string;
  phone: string;
}

/* --------------------------
   Shipping Address Type
-------------------------- */
export interface IShippingAddress {
  thana?: string;
  area?: string;
  city?: string;
  phone?: string;
}

/* --------------------------
   Order Item Type
-------------------------- */
export interface IOrderItem {
  productId: Types.ObjectId | string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

/* --------------------------
   Order Status
-------------------------- */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/* --------------------------
   Order Type
-------------------------- */
export interface IOrder {
  _id?: Types.ObjectId;

  invoice: string;
  userId?: Types.ObjectId; // Ref: User

  customer: ICustomer;

  subtotal: number;
  total: number;
  shippingFee: number;
  discount?: number;

  status?: OrderStatus;

  payment?: IPayment;

  shippingAddress?: IShippingAddress;

  orderItems: IOrderItem[];

  createdAt?: Date;
  updatedAt?: Date;
}