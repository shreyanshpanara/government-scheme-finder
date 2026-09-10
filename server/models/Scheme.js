const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide scheme name'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide scheme short code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    ministry: {
      type: String,
      required: [true, 'Please specify the governing Ministry'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a scheme category'],
      enum: [
        'Agriculture & Rural',
        'Health & Wellness',
        'Education & Learning',
        'Housing & Shelter',
        'Women & Child',
        'Business & MSME',
        'Social Welfare & Empowerment',
        'Skills & Employment',
        'Financial Inclusion',
      ],
    },
    level: {
      type: String,
      enum: ['Central', 'State'],
      default: 'Central',
    },
    state: {
      type: String,
      default: 'All India',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed scheme description'],
    },
    benefits: {
      type: [String],
      required: true,
      default: [],
    },
    benefitAmount: {
      type: String,
      default: 'Direct Benefit Transfer / In-Kind Support',
    },
    eligibilityCriteria: {
      minAge: {
        type: Number,
        default: 0,
      },
      maxAge: {
        type: Number,
        default: 120,
      },
      gender: {
        type: String,
        enum: ['All', 'Male', 'Female', 'Transgender'],
        default: 'All',
      },
      allowedStates: {
        type: [String],
        default: ['All India'],
      },
      allowedDistricts: {
        type: [String],
        default: [],
      },
      maxAnnualIncome: {
        type: Number,
        default: null, // null means no income ceiling
      },
      allowedOccupations: {
        type: [String],
        default: ['All'],
      },
      allowedCategories: {
        type: [String],
        default: ['All'],
      },
      educationLevelRequired: {
        type: [String],
        default: ['All'],
      },
      maritalStatus: {
        type: [String],
        default: ['All'],
      },
      disabilityRequired: {
        type: Boolean,
        default: false,
      },
      minDisabilityPercentage: {
        type: Number,
        default: 0,
      },
      customRules: {
        type: [String],
        default: [],
      },
    },
    documentsRequired: {
      type: [
        {
          name: { type: String, required: true },
          mandatory: { type: Boolean, default: true },
          description: { type: String, default: '' },
        },
      ],
      set: function (docs) {
        if (Array.isArray(docs)) {
          return docs.map((d) => (typeof d === 'string' ? { name: d.trim(), mandatory: true, description: '' } : d));
        }
        return docs;
      },
      default: [],
    },
    applicationProcess: {
      mode: {
        type: String,
        enum: ['Online', 'Offline', 'Both'],
        default: 'Online',
      },
      steps: {
        type: [String],
        default: [],
      },
      officialPortalUrl: {
        type: String,
        default: '',
      },
    },
    officialWebsite: {
      type: String,
      required: [true, 'Please provide the official government URL'],
      trim: true,
    },
    helpline: {
      type: String,
      default: '1800-11-0001 (National Citizen Support)',
    },
    tags: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual aliases for inconsistent field names & developer ergonomics
SchemeSchema.virtual('documents')
  .get(function () {
    return this.documentsRequired;
  })
  .set(function (docs) {
    this.documentsRequired = docs;
  });

SchemeSchema.virtual('status')
  .get(function () {
    return this.active ? 'Active' : 'Inactive';
  })
  .set(function (val) {
    if (typeof val === 'boolean') {
      this.active = val;
    } else if (typeof val === 'string') {
      this.active = val.toLowerCase() === 'active';
    }
  });

SchemeSchema.virtual('isActive')
  .get(function () {
    return this.active;
  })
  .set(function (val) {
    this.active = Boolean(val);
  });

SchemeSchema.virtual('eligibility')
  .get(function () {
    return this.eligibilityCriteria;
  })
  .set(function (val) {
    this.eligibilityCriteria = val;
  });

SchemeSchema.virtual('website')
  .get(function () {
    return this.officialWebsite;
  })
  .set(function (val) {
    this.officialWebsite = val;
  });

SchemeSchema.virtual('helplineNumber')
  .get(function () {
    return this.helpline;
  })
  .set(function (val) {
    this.helpline = val;
  });

// Pre-validation middleware to sanitize and normalize inputs
SchemeSchema.pre('validate', function (next) {
  // Uppercase code
  if (this.code) {
    this.code = this.code.trim().toUpperCase();
  }

  // Normalize documents if provided via 'documents' alias
  if (this.documents && (!this.documentsRequired || this.documentsRequired.length === 0)) {
    this.documentsRequired = this.documents;
  }

  // Support documents as an array of strings
  if (Array.isArray(this.documentsRequired)) {
    this.documentsRequired = this.documentsRequired.map((doc) => {
      if (typeof doc === 'string') {
        return { name: doc.trim(), mandatory: true, description: '' };
      }
      return doc;
    });
  }

  // Support comma-separated tags string or array of strings
  if (typeof this.tags === 'string') {
    this.tags = this.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  } else if (Array.isArray(this.tags)) {
    this.tags = this.tags.map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : t)).filter(Boolean);
  }

  // Support single string benefit
  if (typeof this.benefits === 'string') {
    this.benefits = [this.benefits.trim()];
  }

  // Normalize website if provided via 'website'
  if (this.website && !this.officialWebsite) {
    this.officialWebsite = this.website;
  }

  next();
});

// Indexes for high performance text searching and category filtering
SchemeSchema.index({ name: 'text', description: 'text', tags: 'text' });
SchemeSchema.index({ category: 1, level: 1, active: 1 });

module.exports = mongoose.model('Scheme', SchemeSchema);
