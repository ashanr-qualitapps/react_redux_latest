const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');

// Recalculate and persist order total
const recalcOrderTotal = async (orderId) => {
  const items = await OrderItem.find({ order: orderId });
  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  await Order.findByIdAndUpdate(orderId, { totalAmount: total });
};

// GET /api/order-items?orderId=xxx
const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.query;
    const filter = orderId ? { order: orderId } : {};
    const items = await OrderItem.find(filter)
      .populate('product', 'name price category')
      .populate('order', 'status user')
      .sort({ createdAt: 'asc' });
    res.json(items);
  } catch (error) {
    console.error('getOrderItems error:', error.message);
    res.status(500).json({ message: 'Error fetching order items' });
  }
};

// GET /api/order-items/:id
const getOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findById(req.params.id)
      .populate('product', 'name price')
      .populate('order', 'status');
    if (!item) return res.status(404).json({ message: 'Order item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order item' });
  }
};

// POST /api/order-items  (protected)
const createOrderItem = async (req, res) => {
  const { order, product, quantity, unitPrice } = req.body;
  if (!order || !product || !quantity || unitPrice === undefined) {
    return res.status(400).json({ message: 'order, product, quantity, unitPrice are required' });
  }

  try {
    const item = new OrderItem({ order, product, quantity, unitPrice });
    await item.save();
    await recalcOrderTotal(order);
    const populated = await item.populate('product', 'name price');
    res.status(201).json(populated);
  } catch (error) {
    console.error('createOrderItem error:', error.message);
    res.status(500).json({ message: 'Error creating order item' });
  }
};

// PUT /api/order-items/:id  (protected)
const updateOrderItem = async (req, res) => {
  try {
    const { quantity, unitPrice } = req.body;
    const item = await OrderItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Order item not found' });

    if (quantity !== undefined) item.quantity = quantity;
    if (unitPrice !== undefined) item.unitPrice = unitPrice;
    await item.save(); // triggers pre-save to recalc subtotal

    await recalcOrderTotal(item.order);
    await item.populate('product', 'name price');
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order item' });
  }
};

// DELETE /api/order-items/:id  (protected)
const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Order item not found' });
    await recalcOrderTotal(item.order);
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order item' });
  }
};

module.exports = { getOrderItems, getOrderItem, createOrderItem, updateOrderItem, deleteOrderItem };
