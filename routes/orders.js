const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');

const { sendOrderConfirmationEmail } = require('../lib/send-email');

router.post('/', async (req, res) => {
  try {
    const { itemId, customer, notes } = req.body;

    if (
      !itemId ||
      !customer?.fullName ||
      !customer?.addressLine1 ||
      !customer?.city ||
      !customer?.postcode
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (notes && notes.length > 500) {
      return res
        .status(400)
        .json({ message: 'Notes too long (max 500 characters)' });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const newOrder = new Order({
      itemId: item._id,
      itemSnapshot: {
        title: item.title,
        price: item.price,
      },
      customer,
      notes,
    });

    await newOrder.save();

    try {
      await sendOrderConfirmationEmail({
        customer,
        itemSnapshot: newOrder.itemSnapshot,
        notes,
        _id: newOrder._id,
      });
      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    res.status(201).json({
      message:
        '🎉 Thank you! Your order has been received. We’ll deliver your clay as soon as it is ready!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
