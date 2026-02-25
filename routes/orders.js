const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');

router.post('/', async (req, res) => {
  try {
    const { itemId, customer } = req.body;

    if (
      !itemId ||
      !customer?.fullName ||
      !customer?.addressLine1 ||
      !customer?.city ||
      !customer?.postcode
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
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
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
