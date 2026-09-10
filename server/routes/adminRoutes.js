const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getAllUsers,
  toggleSchemeStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAllUsers);
router.patch('/schemes/:id/toggle-status', toggleSchemeStatus);

module.exports = router;
