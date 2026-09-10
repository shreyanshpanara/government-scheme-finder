const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'gov_scheme_secret_fallback'
    );

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};

// Grant access to specific roles (e.g. admin)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Optional auth - attaches user if valid token exists, proceeds regardless
exports.optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'gov_scheme_secret_fallback'
      );
      req.user = await User.findById(decoded.id);
    } catch (err) {
      // Ignore token verification failure for optional auth
    }
  }
  next();
};
