const User = require('../models/User');

// GET /api/dashboard  (protected)
const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        welcomeMessage: `Welcome back, ${req.user.name}!`,
      },
      recentUsers,
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
