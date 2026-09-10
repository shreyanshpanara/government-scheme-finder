const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');

// @desc    Get admin portal metrics and analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSchemes = await Scheme.countDocuments();
    const activeSchemes = await Scheme.countDocuments({ active: true });
    const totalApplications = await Application.countDocuments();

    // Applications status breakdown
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Schemes by Category
    const categoryStats = await Scheme.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent registered citizens
    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent tracked applications
    const recentApplications = await Application.find()
      .populate('user', 'name email state')
      .populate('scheme', 'name code ministry')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalUsers,
          totalSchemes,
          activeSchemes,
          inactiveSchemes: totalSchemes - activeSchemes,
          totalApplications,
        },
        applicationStats: applicationStats.map((s) => ({ status: s._id, count: s.count })),
        categoryStats: categoryStats.map((c) => ({ category: c._id, count: c.count })),
        recentUsers,
        recentApplications,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: users.length,
      users: users.map((u) => u.toObject({ virtuals: true })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle scheme active status
// @route   PATCH /api/admin/schemes/:id/toggle-status
// @access  Private/Admin
exports.toggleSchemeStatus = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scheme not found',
      });
    }

    scheme.active = !scheme.active;
    await scheme.save();

    res.status(200).json({
      status: 'success',
      message: `Scheme ${scheme.active ? 'activated' : 'deactivated'} successfully`,
      scheme,
    });
  } catch (err) {
    next(err);
  }
};
