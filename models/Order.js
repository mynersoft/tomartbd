const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  items: {
    type: Number,
    required: true,
    min: 1,
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  shipping: {
    address: {
      type: String,
      required: true,
    },
    city: String,
    state: String,
    zipCode: String,
    country: String,
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard',
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  orderItems: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number,
    image: String,
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to update updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate orderId before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
    const lastNumber = lastOrder ? parseInt(lastOrder.orderId.split('-')[1]) : 0;
    this.orderId = `ORD-${String(lastNumber + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);