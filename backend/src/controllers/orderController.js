const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// GET /api/orders  (admin sees all, user sees own)
const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getOrders error:', error.message);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// GET /api/orders/:id  (protected – owner or admin)
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    const items = await OrderItem.find({ order: req.params.id })
      .populate('product', 'name price category');

    res.json({ ...order.toObject(), items });
  } catch (error) {
    console.error('getOrder error:', error.message);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// POST /api/orders  (protected)
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const order = await Order.create({ ...req.body, user: req.user._id });
    await order.populate('user', 'name email');
    res.status(201).json(order);
  } catch (error) {
    console.error('createOrder error:', error.message);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// PUT /api/orders/:id  (protected – owner or admin)
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
};

// DELETE /api/orders/:id  (protected – owner or admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // Cascade-delete order items first
    await OrderItem.deleteMany({ order: req.params.id });
    await order.deleteOne();
    res.json({ message: 'Order and its items deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' });
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrder, deleteOrder };
