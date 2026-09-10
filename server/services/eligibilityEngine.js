/**
 * Rule-based Eligibility Engine for Indian Government Schemes
 * Compares Citizen Profile attributes with Scheme Eligibility Criteria.
 */

// Helper to compute age from Date of Birth
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

/**
 * Evaluate single scheme against a citizen profile
 * @param {Object} profile - Citizen user profile or guest form submission
 * @param {Object} scheme - Scheme document from database
 * @returns {Object} Detailed eligibility report with score, status, and explanations
 */
function evaluateEligibility(profile, scheme) {
  const criteria = scheme.eligibilityCriteria || {};
  const positiveReasons = [];
  const negativeReasons = [];
  const warnings = [];
  const missingProfileFields = [];

  let totalWeight = 0;
  let earnedWeight = 0;

  // Determine user age
  const userAge = profile.age !== undefined && profile.age !== null
    ? Number(profile.age)
    : calculateAge(profile.dateOfBirth);

  // 1. AGE CHECK (Weight: 20)
  totalWeight += 20;
  const minAge = criteria.minAge !== undefined ? criteria.minAge : 0;
  const maxAge = criteria.maxAge !== undefined ? criteria.maxAge : 120;

  if (userAge === null || isNaN(userAge)) {
    missingProfileFields.push('Date of Birth / Age');
    warnings.push(`Scheme requires age between ${minAge} and ${maxAge} years. Please specify your age.`);
    earnedWeight += 10; // Neutral partial score
  } else if (userAge >= minAge && userAge <= maxAge) {
    earnedWeight += 20;
    positiveReasons.push(`Your age (${userAge} years) satisfies the required age range of ${minAge} to ${maxAge} years.`);
  } else {
    negativeReasons.push(`Your age (${userAge} years) does not meet the required age bracket (${minAge} to ${maxAge} years).`);
  }

  // 2. GENDER CHECK (Weight: 20)
  totalWeight += 20;
  const schemeGender = criteria.gender || 'All';
  const userGender = profile.gender;

  if (schemeGender === 'All') {
    earnedWeight += 20;
    positiveReasons.push('Open to all genders (Male, Female, Transgender).');
  } else if (!userGender || userGender === 'Prefer not to say') {
    missingProfileFields.push('Gender');
    warnings.push(`This scheme is targeted for ${schemeGender} applicants.`);
    earnedWeight += 10;
  } else if (userGender.toLowerCase() === schemeGender.toLowerCase()) {
    earnedWeight += 20;
    positiveReasons.push(`Targeted specifically for ${schemeGender} applicants.`);
  } else {
    negativeReasons.push(`This scheme is exclusively reserved for ${schemeGender} citizens.`);
  }

  // 3. STATE / RESIDENCY JURISDICTION (Weight: 15)
  totalWeight += 15;
  const allowedStates = Array.isArray(criteria.allowedStates) && criteria.allowedStates.length > 0
    ? criteria.allowedStates
    : ['All India'];
  const userState = profile.state;

  const isAllIndia = allowedStates.some(s => s && s.toLowerCase() === 'all india') || (scheme.state && scheme.state.toLowerCase() === 'all india');
  if (isAllIndia) {
    earnedWeight += 15;
    positiveReasons.push('Applicable to citizens across all Indian States and Union Territories.');
  } else if (!userState || userState.toLowerCase() === 'all india') {
    missingProfileFields.push('State of Residence');
    warnings.push(`This is a State scheme restricted to: ${allowedStates.join(', ')}.`);
    earnedWeight += 5;
  } else if (
    allowedStates.some(s => s && userState && s.toLowerCase() === userState.toLowerCase()) ||
    (scheme.state && userState && scheme.state.toLowerCase() === userState.toLowerCase())
  ) {
    earnedWeight += 15;
    positiveReasons.push(`Eligible for residents of ${userState}.`);
  } else {
    negativeReasons.push(`Restricted to residents of ${allowedStates.join(', ')}. Not active in ${userState}.`);
  }

  // 4. ANNUAL INCOME CEILING (Weight: 20)
  totalWeight += 20;
  const maxIncome = criteria.maxAnnualIncome;
  const userIncome = profile.annualIncome !== undefined && profile.annualIncome !== null
    ? Number(profile.annualIncome)
    : null;

  if (maxIncome === null || maxIncome === undefined || maxIncome === 0) {
    earnedWeight += 20;
    positiveReasons.push('No maximum income ceiling; universally accessible.');
  } else if (userIncome === null || isNaN(userIncome)) {
    missingProfileFields.push('Annual Family Income');
    warnings.push(`Scheme requires annual income below ₹${maxIncome.toLocaleString('en-IN')}.`);
    earnedWeight += 10;
  } else if (userIncome <= maxIncome) {
    earnedWeight += 20;
    positiveReasons.push(`Your annual income (₹${userIncome.toLocaleString('en-IN')}) is within the ceiling of ₹${maxIncome.toLocaleString('en-IN')}.`);
  } else {
    negativeReasons.push(`Annual income of ₹${userIncome.toLocaleString('en-IN')} exceeds the ceiling limit of ₹${maxIncome.toLocaleString('en-IN')}.`);
  }

  // 5. OCCUPATION MATCH (Weight: 15)
  totalWeight += 15;
  const allowedOccupations = criteria.allowedOccupations || ['All'];
  const userOccupation = profile.occupation;

  if (allowedOccupations.includes('All')) {
    earnedWeight += 15;
    positiveReasons.push('Applicable regardless of specific occupational sector.');
  } else if (!userOccupation || userOccupation === 'Other' || userOccupation === 'Not Specified') {
    missingProfileFields.push('Occupation');
    warnings.push(`Targeted primarily for: ${allowedOccupations.join(', ')}.`);
    earnedWeight += 5;
  } else if (allowedOccupations.some(o => o.toLowerCase() === userOccupation.toLowerCase())) {
    earnedWeight += 15;
    positiveReasons.push(`Your occupation (${userOccupation}) matches target beneficiaries.`);
  } else {
    negativeReasons.push(`Targeted for ${allowedOccupations.join(', ')}. Current occupation is ${userOccupation}.`);
  }

  // 6. SOCIAL CATEGORY MATCH (Weight: 10)
  totalWeight += 10;
  const allowedCategories = criteria.allowedCategories || ['All'];
  const userCategory = profile.category;

  if (allowedCategories.includes('All')) {
    earnedWeight += 10;
    positiveReasons.push('Open to citizens of all social categories (General, OBC, SC, ST, EWS).');
  } else if (!userCategory) {
    missingProfileFields.push('Social Category');
    warnings.push(`Targeted for categories: ${allowedCategories.join(', ')}.`);
    earnedWeight += 5;
  } else if (allowedCategories.some(c => c.toLowerCase() === userCategory.toLowerCase())) {
    earnedWeight += 10;
    positiveReasons.push(`Category (${userCategory}) is eligible.`);
  } else {
    negativeReasons.push(`Reserved for ${allowedCategories.join(', ')} categories.`);
  }

  // 7. DISABILITY REQUIREMENT
  if (criteria.disabilityRequired) {
    totalWeight += 15;
    const userDisability = Boolean(profile.disabilityStatus);
    const minPercent = criteria.minDisabilityPercentage || 40;

    if (userDisability) {
      earnedWeight += 15;
      positiveReasons.push(`Requires Divyangjan status; matched.`);
    } else {
      negativeReasons.push(`Requires benchmark disability (min ${minPercent}%) with valid UDID card.`);
    }
  }

  // CALCULATE MATCH SCORE (0 - 100%)
  const matchScore = Math.min(100, Math.max(0, Math.round((earnedWeight / totalWeight) * 100)));

  // DETERMINE ELIGIBILITY STATUS
  let status = 'INELIGIBLE';
  if (negativeReasons.length === 0) {
    if (matchScore >= 80 && missingProfileFields.length === 0) {
      status = 'ELIGIBLE';
    } else {
      status = 'LIKELY_ELIGIBLE';
    }
  } else if (negativeReasons.length === 1 && warnings.length === 0 && matchScore >= 65) {
    status = 'LIKELY_ELIGIBLE';
  } else {
    status = 'INELIGIBLE';
  }

  return {
    schemeId: scheme._id,
    schemeName: scheme.name,
    schemeCode: scheme.code,
    category: scheme.category,
    ministry: scheme.ministry,
    status, // 'ELIGIBLE' | 'LIKELY_ELIGIBLE' | 'INELIGIBLE'
    matchScore, // 0 - 100%
    positiveReasons,
    negativeReasons,
    warnings,
    missingProfileFields,
    benefitAmount: scheme.benefitAmount,
    officialWebsite: scheme.officialWebsite,
    documentsRequired: scheme.documentsRequired || scheme.documents || [],
    documents: scheme.documentsRequired || scheme.documents || [],
  };
}

/**
 * Batch evaluate all active schemes against a citizen profile
 */
function evaluateAllSchemes(profile, schemes) {
  const evaluations = schemes.map((scheme) => evaluateEligibility(profile, scheme));

  // Sort by match score descending, then by status
  evaluations.sort((a, b) => {
    const statusOrder = { ELIGIBLE: 3, LIKELY_ELIGIBLE: 2, INELIGIBLE: 1 };
    if (statusOrder[b.status] !== statusOrder[a.status]) {
      return statusOrder[b.status] - statusOrder[a.status];
    }
    return b.matchScore - a.matchScore;
  });

  return evaluations;
}

module.exports = {
  evaluateEligibility,
  evaluateAllSchemes,
  calculateAge,
};
