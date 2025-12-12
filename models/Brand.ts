import mongoose from "mongoose";

export interface IBrand extends mongoose.Document {
  name: string;
  slug: string;
  logo?: string;
  status: "active" | "inactive";
}

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Brand ||
  mongoose.model<IBrand>("Brand", BrandSchema);