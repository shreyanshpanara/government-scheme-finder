const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  saveBookmark,
  removeBookmark,
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getBookmarks);
router.post('/:schemeId', protect, saveBookmark);
router.delete('/:schemeId', protect, removeBookmark);

module.exports = router;
