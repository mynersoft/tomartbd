import mongoose, { Schema, model, Types } from "mongoose";

interface ICartItem {
	product: Types.ObjectId;
	variant?: string; // optional variant id or name
	quantity: number;
}

interface ICart {
	user: Types.ObjectId;
	items: ICartItem[];
	createdAt?: Date;
	updatedAt?: Date;
}

const CartItemSchema = new Schema<ICartItem>({
	product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
	variant: { type: String },
	quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new Schema<ICart>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		items: [CartItemSchema],
	},
	{ timestamps: true }
);

export default mongoose.models.Cart || model<ICart>("Cart", CartSchema);
