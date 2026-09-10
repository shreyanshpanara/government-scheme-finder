const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { evaluateEligibility } = require('../services/eligibilityEngine');

// @desc    Get personalized scheme recommendations for logged-in citizen
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Citizen profile not found',
      });
    }

    const schemes = await Scheme.find({ active: true });
    const userProfile = user.toObject({ virtuals: true });

    // Evaluate each scheme
    const evaluated = schemes.map((scheme) => {
      const evaluation = evaluateEligibility(userProfile, scheme);

      // Category relevance booster
      let relevanceScore = evaluation.matchScore;

      // Bonus if scheme explicitly matches citizen's occupation or category
      if (
        user.occupation &&
        Array.isArray(scheme.eligibilityCriteria?.allowedOccupations) &&
        scheme.eligibilityCriteria.allowedOccupations.some(
          (o) => o && o.toLowerCase() === user.occupation.toLowerCase()
        )
      ) {
        relevanceScore += 10;
      }
      if (
        user.category &&
        Array.isArray(scheme.eligibilityCriteria?.allowedCategories) &&
        scheme.eligibilityCriteria.allowedCategories.some(
          (c) => c && c.toLowerCase() === user.category.toLowerCase()
        )
      ) {
        relevanceScore += 5;
      }
      if (scheme.featured) {
        relevanceScore += 5;
      }

      return {
        scheme,
        evaluation,
        relevanceScore: Math.min(100, relevanceScore),
        isSaved: user.savedSchemes.some((id) => id.toString() === scheme._id.toString()),
      };
    });

    // Sort by status priority first (ELIGIBLE > LIKELY_ELIGIBLE > INELIGIBLE) and relevanceScore
    evaluated.sort((a, b) => {
      const statusOrder = { ELIGIBLE: 3, LIKELY_ELIGIBLE: 2, INELIGIBLE: 1 };
      if (statusOrder[b.evaluation.status] !== statusOrder[a.evaluation.status]) {
        return statusOrder[b.evaluation.status] - statusOrder[a.evaluation.status];
      }
      return b.relevanceScore - a.relevanceScore;
    });

    // Top recommended eligible & likely eligible schemes
    const recommended = evaluated.filter((item) => item.evaluation.status !== 'INELIGIBLE');
    const exploreOthers = evaluated.filter((item) => item.evaluation.status === 'INELIGIBLE');

    res.status(200).json({
      status: 'success',
      type: 'RULE_BASED_RECOMMENDATION',
      profileCompletion: userProfile.profileCompletion,
      totalRecommended: recommended.length,
      recommendations: recommended,
      exploreOthers: exploreOthers.slice(0, 4),
    });
  } catch (err) {
    next(err);
  }
};
