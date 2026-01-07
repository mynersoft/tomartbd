import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    path: {
      type: String, // page visited
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models.Visitor ||
  mongoose.model('Visitor', visitorSchema);
