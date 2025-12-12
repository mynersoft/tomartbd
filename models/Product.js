import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, unique: true },
		price: { type: Number, required: true },
		brand: String,
		category: String,
		stock: Number,
		description: String,
		images: [String],
	},
	{ timestamps: true }
);

export default mongoose.models.Product ||
	mongoose.model("Product", ProductSchema);
