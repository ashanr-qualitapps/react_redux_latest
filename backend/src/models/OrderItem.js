const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate subtotal before save
orderItemSchema.pre('save', function (next) {
  this.subtotal = this.quantity * this.unitPrice;
  next();
});

// Also recalculate on findOneAndUpdate
orderItemSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.quantity !== undefined || update.unitPrice !== undefined) {
    const qty = update.quantity || this._update?.$set?.quantity;
    const price = update.unitPrice || this._update?.$set?.unitPrice;
    if (qty && price) {
      this.set({ subtotal: qty * price });
    }
  }
  next();
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
