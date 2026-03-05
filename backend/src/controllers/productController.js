const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50, category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('getProducts error:', error.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// POST /api/products  (protected)
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error.message);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// PUT /api/products/:id  (protected)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// DELETE /api/products/:id  (protected)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
