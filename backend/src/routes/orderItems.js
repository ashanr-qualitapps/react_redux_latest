const express = require('express');
const {
  getOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../controllers/orderItemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getOrderItems);       // ?orderId=xxx
router.get('/:id', protect, getOrderItem);
router.post('/', protect, createOrderItem);
router.put('/:id', protect, updateOrderItem);
router.delete('/:id', protect, deleteOrderItem);

module.exports = router;
