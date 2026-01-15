import mongoose from 'mongoose';

const BogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: Object,
      default: {
        url: '',
        publicId: '',
      },
    },
    galleryImages: {
      type: [Object],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    mainItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    freeItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    buyQty: {
      type: Number,
      default: 1,
    },
    getQty: {
      type: Number,
      default: 1,
    },
    isSameProduct: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    regularPrice: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Bogo || mongoose.model('Bogo', BogoSchema);
