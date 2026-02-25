const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },

    itemSnapshot: {
      title: String,
      price: Number,
    },

    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },
      addressLine2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      postcode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        default: 'UK',
      },
    },

    status: {
      type: String,
      default: 'pending',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
