import mongoose from 'mongoose';
import slugify from 'slugify';

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 60,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    logo: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
