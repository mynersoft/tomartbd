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

// 🔥 Slugify helper function
function slugify(text) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

ProductSchema.pre("save", async function (next) {
	if (!this.isModified("name")) return next();

	let baseSlug = slugify(this.name) + "-tomartbd";
	let slug = baseSlug;

	// Check if slug exists
	const Product = mongoose.model("Product");

	let counter = 1;
	let exists = await Product.findOne({ slug });

	while (exists) {
		slug = `${baseSlug}-${counter}`;
		counter++;
		exists = await Product.findOne({ slug });
	}

	this.slug = slug;
	next();
});

export default mongoose.models.Product ||
	mongoose.model("Product", ProductSchema);
