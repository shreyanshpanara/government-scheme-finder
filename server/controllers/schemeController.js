
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');

// Helper to safely escape regex characters
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// @desc Get all schemes with filtering, search, sorting and pagination
// @route GET /api/schemes
// @access Public
exports.getSchemes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      state,
      gender,
      maxIncome,
      age,
      tag,
      tags,
      active,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Active status filter
    if (active !== undefined) {
      if (active !== 'all') {
        query.active = active === 'true' || active === true;
      }
    } else if (status !== undefined) {
      if (status.toLowerCase() !== 'all') {
        query.active = status.toLowerCase() === 'active';
      }
    } else {
      query.active = true;
    }

    // Search schemes
    if (search && search.trim()) {
      const escapedSearch = escapeRegex(search.trim());

      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { code: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { ministry: { $regex: escapedSearch, $options: 'i' } },
        { department: { $regex: escapedSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(escapedSearch, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // State filter
    if (state && state !== 'All India') {
      query.$and = query.$and || [];

      query.$and.push({
        $or: [
          { state: 'All India' },
          { state },
          {
            'eligibilityCriteria.allowedStates': {
              $in: ['All India', state],
            },
          },
        ],
      });
    }

    // Gender filter
    if (gender && gender !== 'All') {
      query.$and = query.$and || [];

      query.$and.push({
        $or: [
          { 'eligibilityCriteria.gender': 'All' },
          { 'eligibilityCriteria.gender': gender },
        ],
      });
    }

    // Age filter
    if (age) {
      const numAge = Number(age);

      if (!Number.isNaN(numAge)) {
        query.$and = query.$and || [];

        query.$and.push({
          'eligibilityCriteria.minAge': { $lte: numAge },
          'eligibilityCriteria.maxAge': { $gte: numAge },
        });
      }
    }

    // Income filter
    if (maxIncome) {
      const numIncome = Number(maxIncome);

      if (!Number.isNaN(numIncome)) {
        query.$and = query.$and || [];

        query.$and.push({
          $or: [
            { 'eligibilityCriteria.maxAnnualIncome': null },
            {
              'eligibilityCriteria.maxAnnualIncome': {
                $gte: numIncome,
              },
            },
          ],
        });
      }
    }

    // Tags filter
    const tagFilter = tag || tags;

    if (tagFilter && tagFilter !== 'All') {
      const escapedTag = escapeRegex(tagFilter.trim());

      query.tags = {
        $in: [new RegExp(`^${escapedTag}$`, 'i')],
      };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortBy = { createdAt: -1 };

    if (sort === 'name-asc') {
      sortBy = { name: 1 };
    }

    if (sort === 'name-desc') {
      sortBy = { name: -1 };
    }

    if (sort === 'popular') {
      sortBy = { featured: -1, createdAt: -1 };
    }

    const total = await Scheme.countDocuments(query);

    const schemes = await Scheme.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      status: 'success',
      count: schemes.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      schemes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get single scheme by ID or code
// @route GET /api/schemes/:id
// @access Public
exports.getSchemeById = async (req, res, next) => {
  try {
    const queryId = req.params.id ? req.params.id.trim() : '';
    let scheme = null;

    if (mongoose.Types.ObjectId.isValid(queryId)) {
      scheme = await Scheme.findById(queryId);
    }

    if (!scheme) {
      scheme = await Scheme.findOne({
        code: queryId.toUpperCase(),
      });
    }

    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      scheme,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get categories summary with counts
// @route GET /api/schemes/categories
// @access Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Scheme.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      status: 'success',
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// Helper to normalize scheme payload
function normalizeSchemePayload(body) {
  const payload = { ...body };

  // Normalize documents
  let rawDocs = payload.documentsRequired || payload.documents;

  if (rawDocs) {
    if (typeof rawDocs === 'string') {
      rawDocs = rawDocs
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
    }

    if (Array.isArray(rawDocs)) {
      payload.documentsRequired = rawDocs
        .map((doc) => {
          if (typeof doc === 'string') {
            return {
              name: doc.trim(),
              mandatory: true,
              description: '',
            };
          }

          if (doc && typeof doc === 'object') {
            return {
              name: doc.name || '',
              mandatory:
                doc.mandatory !== undefined
                  ? Boolean(doc.mandatory)
                  : true,
              description: doc.description || '',
            };
          }

          return doc;
        })
        .filter((d) => d && d.name);
    }
  }

  // Normalize tags
  const rawTags = payload.tags;

  if (typeof rawTags === 'string') {
    payload.tags = rawTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  } else if (Array.isArray(rawTags)) {
    payload.tags = rawTags
      .map((t) =>
        typeof t === 'string' ? t.trim().toLowerCase() : t
      )
      .filter(Boolean);
  }

  // Normalize benefits
  if (typeof payload.benefits === 'string') {
    payload.benefits = payload.benefits
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
  }

  // Normalize status / active
  if (payload.status !== undefined && payload.active === undefined) {
    payload.active = String(payload.status).toLowerCase() === 'active';
  }

  if (payload.isActive !== undefined && payload.active === undefined) {
    payload.active = Boolean(payload.isActive);
  }

  // Normalize website
  if (payload.website && !payload.officialWebsite) {
    payload.officialWebsite = payload.website;
  }

  // Normalize helpline
  if (payload.helplineNumber && !payload.helpline) {
    payload.helpline = payload.helplineNumber;
  }

  // Normalize code
  if (payload.code) {
    payload.code = payload.code.trim().toUpperCase();
  }

  return payload;
}

// @desc Create new scheme
// @route POST /api/schemes
// @access Private/Admin
exports.createScheme = async (req, res, next) => {
  try {
    const payload = normalizeSchemePayload(req.body);
    const scheme = await Scheme.create(payload);

    return res.status(201).json({
      status: 'success',
      message: 'Government scheme created successfully',
      scheme,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update scheme
// @route PUT/PATCH /api/schemes/:id
// @access Private/Admin
exports.updateScheme = async (req, res, next) => {
  try {
    const queryId = req.params.id ? req.params.id.trim() : '';
    let targetId = null;

    if (mongoose.Types.ObjectId.isValid(queryId)) {
      targetId = queryId;
    } else {
      const existing = await Scheme.findOne({
        code: queryId.toUpperCase(),
      });

      if (existing) {
        targetId = existing._id;
      }
    }

    if (!targetId) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    const payload = normalizeSchemePayload(req.body);

    const scheme = await Scheme.findByIdAndUpdate(
      targetId,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Government scheme updated successfully',
      scheme,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete scheme
// @route DELETE /api/schemes/:id
// @access Private/Admin
exports.deleteScheme = async (req, res, next) => {
  try {
    const queryId = req.params.id ? req.params.id.trim() : '';
    let targetId = null;

    if (mongoose.Types.ObjectId.isValid(queryId)) {
      targetId = queryId;
    } else {
      const existing = await Scheme.findOne({
        code: queryId.toUpperCase(),
      });

      if (existing) {
        targetId = existing._id;
      }
    }

    if (!targetId) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    const deleted = await Scheme.findByIdAndDelete(targetId);

    if (!deleted) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Government scheme deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc Toggle scheme active status
// @route PATCH /api/schemes/:id/toggle-status
// @access Private/Admin
exports.toggleSchemeStatus = async (req, res, next) => {
  try {
    const queryId = req.params.id ? req.params.id.trim() : '';
    let scheme = null;

    if (mongoose.Types.ObjectId.isValid(queryId)) {
      scheme = await Scheme.findById(queryId);
    } else {
      scheme = await Scheme.findOne({
        code: queryId.toUpperCase(),
      });
    }

    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    scheme.active = !scheme.active;
    await scheme.save();

    return res.status(200).json({
      status: 'success',
      message: `Scheme ${
        scheme.active ? 'activated' : 'deactivated'
      } successfully`,
      scheme,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get scheme statistics for dashboard
// @route GET /api/schemes/stats
// @access Private/Admin
exports.getSchemeStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [
      totalRecords,
      activeRecords,
      recordsAddedToday,
    ] = await Promise.all([
      Scheme.countDocuments(),

      Scheme.countDocuments({
        active: true,
      }),

      Scheme.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        },
      }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        totalRecords,
        activeRecords,
        recordsAddedToday,
      },
    });
  } catch (err) {
    next(err);
  }
};
