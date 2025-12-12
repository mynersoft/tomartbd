import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	price: { type: Number, required: true },
	stock: { type: Number, default: 0 },
	image: { type: String },
	createdAt: { type: Date, default: Date.now },
});

const Product = models.Product || model("Product", ProductSchema);
export default Product;
