require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB, disconnectDB } = require('./config/db');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const eligibilityRoutes = require('./routes/eligibilityRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Base Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Welcome Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Government Scheme Finder API',
    documentation: '/api/health',
    status: 'ACTIVE'
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `API Route ${req.originalUrl} not found`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err.message);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    message = `Validation failed: ${messages.join('. ')}`;
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const fields = Object.keys(err.keyValue || {});
    message = `Duplicate field value: A record with that ${fields.join(', ')} already exists.`;
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': ${err.value}`;
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Auto-seed if database is empty (for immediate out-of-the-box readiness)
const Scheme = require('./models/Scheme');
const schemesData = require('./seed/seedData');
const User = require('./models/User');

const checkAndSeed = async () => {
  try {
    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
      console.log('[Auto-Seed]: Database is empty. Seeding authentic Indian schemes...');
      await Scheme.insertMany(schemesData);
      
      const adminExists = await User.findOne({ email: 'admin@govscheme.nic.in' });
      if (!adminExists) {
        await User.create({
          name: 'National Admin Officer',
          email: 'admin@govscheme.nic.in',
          password: 'Admin@12345',
          phone: '9811001122',
          role: 'admin',
          state: 'Delhi',
          district: 'New Delhi',
          category: 'General',
          occupation: 'Salaried Employee',
          annualIncome: 1200000,
          education: 'Post Graduate'
        });
      }

      const citizenExists = await User.findOne({ email: 'citizen@example.com' });
      if (!citizenExists) {
        const firstScheme = await Scheme.findOne();
        await User.create({
          name: 'Rameshwar Lal Patel',
          email: 'citizen@example.com',
          password: 'Citizen@12345',
          phone: '9876543210',
          dateOfBirth: new Date('1988-06-15'),
          gender: 'Male',
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          category: 'OBC',
          occupation: 'Farmer',
          annualIncome: 180000,
          education: '10th Pass',
          maritalStatus: 'Married',
          disabilityStatus: false,
          role: 'user',
          savedSchemes: firstScheme ? [firstScheme._id] : []
        });
      }
      console.log('[Auto-Seed]: Successfully initialized default government schemes and demo accounts.');
    }
  } catch (err) {
    console.warn('[Auto-Seed]: Note:', err.message);
  }
};

// Connect to DB and start listening
const startServer = async () => {
  try {
    await connectDB();
    await checkAndSeed();
    const server = app.listen(PORT, () => {
      console.log(`[Gov Scheme Finder Server]: Running on http://localhost:${PORT}`);
      console.log(`[Health Check]: http://localhost:${PORT}/api/health`);
    });

    const handleGracefulShutdown = async (signal) => {
      console.log(`\n[Server]: ${signal} received. Closing HTTP server and disconnecting DB...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

    return server;
  } catch (err) {
    console.error('[Fatal Server Error]:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, checkAndSeed };
