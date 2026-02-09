import mongoose, { Schema, Document, Model } from "mongoose";
import { IVisitor } from "@/types/visitor";

interface VisitorDocument extends Omit<IVisitor, "_id">, Document {}

const visitorSchema = new Schema<VisitorDocument>(
  {
    ip: { type: String, required: true },
    userAgent: { type: String },
    path: { type: String }, // page visited
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
const Visitor: Model<VisitorDocument> =
  mongoose.models.Visitor || mongoose.model<VisitorDocument>("Visitor", visitorSchema);

export default Visitor;