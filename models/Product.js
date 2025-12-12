import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Product description is required"],
		},
		category: {
			type: String,
			required: true,
			enum: ["electronics", "mobile", "fashion", "hardware", "other"], // customize
		},
		brand: { type: String },
		price: {
			type: Number,
			required: true,
		},
		discount: {
			type: Number, // percentage
			default: 0,
		},
		finalPrice: {
			type: Number,
		},
		stock: {
			type: Number,
			default: 0,
		},
		inStock: {
			type: Boolean,
			default: true,
		},
		sku: { type: String, unique: true },
		images: [
			{
				url: String,
				alt: String,
			},
		],
		variants: [
			{
				color: String,
				size: String,
				price: Number,
				stock: Number,
				sku: String,
			},
		],
		ratings: {
			type: Number,
			default: 0,
		},
		reviews: [
			{
				user: { type: Schema.Types.ObjectId, ref: "User" },
				rating: Number,
				comment: String,
				createdAt: { type: Date, default: Date.now },
			},
		],
		tags: [String],
		featured: {
			type: Boolean,
			default: false,
		},
		bestseller: {
			type: Boolean,
			default: false,
		},
		newArrival: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// Pre-save hook to calculate final price after discount
ProductSchema.pre("save", function (next) {
	if (this.discount > 0) {
		this.finalPrice = this.price - (this.price * this.discount) / 100;
	} else {
		this.finalPrice = this.price;
	}

	this.inStock = this.stock > 0;
	next();
});

export default mongoose.models.Product ||
	mongoose.model("Product", ProductSchema);
