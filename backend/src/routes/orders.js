const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post(
  '/',
  protect,
  [body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required')],
  createOrder
);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
