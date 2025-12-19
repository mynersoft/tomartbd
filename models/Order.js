import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		invoice: {
			type: String,
			unique: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		payment: {
			method: {
				type: String,
				enum: ["COD", "bKash"," Nogod","Rocket"],
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
	},
	{ timestamps: true }
);


export default mongoose.models.Order ||
	mongoose.model("Order", orderSchema);