const express = require('express');
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  getCategories,
  createScheme,
  updateScheme,
  deleteScheme,
  toggleSchemeStatus,
} = require('../controllers/schemeController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);
router.get('/', optionalAuth, getSchemes);
router.get('/:id', optionalAuth, getSchemeById);

// Admin protected routes
router.post('/', protect, authorize('admin'), createScheme);
router.put('/:id', protect, authorize('admin'), updateScheme);
router.patch('/:id', protect, authorize('admin'), updateScheme);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleSchemeStatus);
router.delete('/:id', protect, authorize('admin'), deleteScheme);

module.exports = router;
