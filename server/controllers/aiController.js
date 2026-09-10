const aiService = require('../services/aiService');

// @desc    Ask AI Assistant for scheme guidance
// @route   POST /api/ai/chat
// @access  Public (available to citizens and guests)
exports.chat = async (req, res, next) => {
  try {
    const { query, currentSchemeId, context } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide your question or query.',
      });
    }

    const resolvedContext = {
      ...context,
      currentSchemeId,
      userProfile: req.user ? req.user : null,
    };

    const result = await aiService.generateResponse(query, resolvedContext);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
