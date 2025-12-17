import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			unique: true,
		},
		customer: {
			name: { type: String, required: true },
			email: { type: String, required: true },
			phone: { type: String, required: true },
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		payment: {
			method: {
				type: String,
				enum: ["cash_on_delivery"],
				required: true,
			},
			status: {
				type: String,
				default: "pending",
			},
		},
		shipping: {
			address: { type: String, required: true },
			city: String,
			phone: String,
		},
		orderItems: [
			{
				productId: String,
				name: String,
				quantity: Number,
				price: Number,
			},
		],
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);


export default mongoose.models.Order ||
	mongoose.model("Order", orderSchema);