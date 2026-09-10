const mongoose = require('mongoose');

let mongod = null;

// Event listeners for runtime connection monitoring
mongoose.connection.on('connected', () => {
  console.log(`[Mongoose Event]: Connected to database (${mongoose.connection.name})`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[Mongoose Event Error]: Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Mongoose Event]: Disconnected from database');
});

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI (Atlas/Local)...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // Fail fast if Atlas cluster is unreachable
      });
      console.log(`[MongoDB Connected]: ${conn.connection.host}`);
      return conn;
    }

    // Development fallback using MongoMemoryServer
    console.log('No MONGODB_URI found. Initializing MongoMemoryServer for development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();

    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Memory Server Connected]: In-Memory DB active at ${mongoUri}`);
    console.log('Tip: Set MONGODB_URI in server/.env to use your MongoDB Atlas cluster.');
    return conn;
  } catch (error) {
    console.error(`[Database Error]: ${error.message}`);
    // If external URI failed and we are in development, try fallback to memory server
    if (!mongod && process.env.NODE_ENV !== 'production') {
      try {
        console.log('Attempting development fallback to MongoMemoryServer...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`[Fallback MongoDB Memory Server Connected]: ${fallbackUri}`);
        return conn;
      } catch (fallbackErr) {
        console.error(`[Fallback DB Error]: ${fallbackErr.message}`);
      }
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('[MongoDB]: Successfully disconnected and stopped.');
  } catch (err) {
    console.error('[MongoDB Disconnect Error]:', err.message);
  }
};

const getDatabaseStatus = () => {
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    state: readyStates[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    isConnected: mongoose.connection.readyState === 1,
    isInMemory: !!mongod,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

module.exports = { connectDB, disconnectDB, getDatabaseStatus };
