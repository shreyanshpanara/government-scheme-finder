const User = require('../models/User');
const Scheme = require('../models/Scheme');

// @desc    Get user's saved schemes
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedSchemes');
    const validSaved = (user.savedSchemes || []).filter(Boolean);

    res.status(200).json({
      status: 'success',
      count: validSaved.length,
      savedSchemes: validSaved,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bookmark / Save a scheme
// @route   POST /api/bookmarks/:schemeId
// @access  Private
exports.saveBookmark = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already bookmarked
    const alreadySaved = user.savedSchemes.some(
      (id) => id.toString() === req.params.schemeId
    );

    if (alreadySaved) {
      return res.status(400).json({
        status: 'fail',
        message: 'Scheme is already in your saved list',
      });
    }

    user.savedSchemes.push(req.params.schemeId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Scheme saved successfully to your portal',
      savedSchemes: user.savedSchemes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:schemeId
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.savedSchemes = user.savedSchemes.filter(
      (id) => id.toString() !== req.params.schemeId
    );
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Scheme removed from saved list',
      savedSchemes: user.savedSchemes,
    });
  } catch (err) {
    next(err);
  }
};
