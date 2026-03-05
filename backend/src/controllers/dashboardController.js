const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/dashboard  (protected)
const getDashboardData = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      recentUsers,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        welcomeMessage: `Welcome back, ${req.user.name}!`,
      },
      recentUsers,
      recentOrders,
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        memberSince: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

module.exports = { getDashboardData };
