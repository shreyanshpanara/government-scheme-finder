const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    state: {
      type: String,
      trim: true,
      default: 'All India',
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'All'],
      default: 'General',
    },
    occupation: {
      type: String,
      enum: [
        'Farmer',
        'Student',
        'Salaried Employee',
        'Self-Employed / Business',
        'Daily Wage Worker / Labour',
        'Artisan / Craftsman',
        'Street Vendor',
        'Unemployed',
        'Retired / Senior Citizen',
        'Homemaker',
        'Other',
      ],
      default: 'Other',
    },
    annualIncome: {
      type: Number,
      default: 0,
      min: [0, 'Annual income cannot be negative'],
    },
    education: {
      type: String,
      enum: [
        'Below 10th',
        '10th Pass',
        '12th Pass',
        'Diploma / ITI',
        'Graduate',
        'Post Graduate',
        'Doctorate',
        'Not Specified',
      ],
      default: 'Not Specified',
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Widowed', 'Divorced', 'Not Specified'],
      default: 'Not Specified',
    },
    disabilityStatus: {
      type: Boolean,
      default: false,
    },
    disabilityPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    savedSchemes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'gov_scheme_secret_fallback',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate profile completion percentage virtual
UserSchema.virtual('profileCompletion').get(function () {
  const fields = [
    this.name,
    this.email,
    this.phone,
    this.dateOfBirth,
    this.gender !== 'Prefer not to say' ? this.gender : null,
    this.state && this.state !== 'All India' ? this.state : null,
    this.district,
    this.category,
    this.occupation && this.occupation !== 'Other' ? this.occupation : null,
    this.annualIncome !== undefined ? this.annualIncome : null,
    this.education && this.education !== 'Not Specified' ? this.education : null,
    this.maritalStatus && this.maritalStatus !== 'Not Specified' ? this.maritalStatus : null,
  ];

  const filledCount = fields.filter((f) => f !== null && f !== undefined && f !== '').length;
  return Math.round((filledCount / fields.length) * 100);
});

module.exports = mongoose.model('User', UserSchema);
