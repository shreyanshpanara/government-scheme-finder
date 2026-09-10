const User = require('../models/User');
require('../models/Scheme');

// Helper to format user response and attach token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  const userObj = user.toObject ? user.toObject({ virtuals: true }) : user;
  delete userObj.password;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user: userObj,
  });
};

// @desc    Register citizen user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      state,
      district,
      category,
      occupation,
      annualIncome,
      education,
      maritalStatus,
      disabilityStatus,
      disabilityPercentage,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide full name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'A citizen account with this email address already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      dateOfBirth,
      gender,
      state,
      district,
      category,
      occupation,
      annualIncome: Number(annualIncome) || 0,
      education,
      maritalStatus,
      disabilityStatus: Boolean(disabilityStatus),
      disabilityPercentage: Number(disabilityPercentage) || 0,
      role: 'user', // Default safe role
    });

    sendTokenResponse(user, 201, res, 'Citizen registered successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both email and password',
      });
    }

    // Check for user and explicitly include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials. No citizen profile found with this email.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials. The password entered is incorrect.',
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in citizen
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedSchemes');

    res.status(200).json({
      status: 'success',
      user: user.toObject({ virtuals: true }),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update citizen profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'phone',
      'dateOfBirth',
      'gender',
      'state',
      'district',
      'category',
      'occupation',
      'annualIncome',
      'education',
      'maritalStatus',
      'disabilityStatus',
      'disabilityPercentage',
    ];

    const fieldsToUpdate = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Citizen profile updated successfully',
      user: updatedUser.toObject({ virtuals: true }),
    });
  } catch (err) {
    next(err);
  }
};
