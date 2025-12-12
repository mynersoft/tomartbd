// models/Coupon.ts
import mongoose from "mongoose";

export interface ICoupon extends mongoose.Document {
	code: string;
	discount: number; // percentage
	expiry: Date;
	usageLimit: number; // max uses
	used: number; // used count
}

const CouponSchema = new mongoose.Schema(
	{
		code: { type: String, required: true, unique: true },
		discount: { type: Number, required: true },
		expiry: { type: Date, required: true },
		usageLimit: { type: Number, default: 1 },
		used: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);