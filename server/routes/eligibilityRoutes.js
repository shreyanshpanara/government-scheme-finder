const express = require('express');
const router = express.Router();
const {
  checkSingleSchemeEligibility,
  checkAllSchemesEligibility,
} = require('../controllers/eligibilityController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/check-all', optionalAuth, checkAllSchemesEligibility);
router.post('/check/:schemeId', optionalAuth, checkSingleSchemeEligibility);

module.exports = router;
