const Scheme = require('../models/Scheme');
const User = require('../models/User');
const {
  evaluateEligibility,
  evaluateAllSchemes,
} = require('../services/eligibilityEngine');

// Helper to resolve profile from authenticated user or request body
const resolveProfile = async (req) => {
  if (req.user) {
    const userDoc = await User.findById(req.user.id);
    // Overlay any custom query overrides (e.g. testing different income/age)
    return {
      ...userDoc.toObject({ virtuals: true }),
      ...req.body,
    };
  }
  return req.body || {};
};

// @desc    Check eligibility for a single scheme
// @route   POST /api/eligibility/check/:schemeId
// @access  Public (Works for logged-in or guest users)
exports.checkSingleSchemeEligibility = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    const profile = await resolveProfile(req);
    const result = evaluateEligibility(profile, scheme);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check eligibility against all active government schemes
// @route   POST /api/eligibility/check-all
// @access  Public (Works for logged-in citizens or guest form input)
exports.checkAllSchemesEligibility = async (req, res, next) => {
  try {
    const profile = await resolveProfile(req);
    const schemes = await Scheme.find({ active: true });

    const results = evaluateAllSchemes(profile, schemes);

    const eligible = results.filter((r) => r.status === 'ELIGIBLE');
    const likelyEligible = results.filter((r) => r.status === 'LIKELY_ELIGIBLE');
    const ineligible = results.filter((r) => r.status === 'INELIGIBLE');

    res.status(200).json({
      status: 'success',
      totalEvaluated: schemes.length,
      summary: {
        eligibleCount: eligible.length,
        likelyEligibleCount: likelyEligible.length,
        ineligibleCount: ineligible.length,
      },
      results,
    });
  } catch (err) {
    next(err);
  }
};
