const express = require('express');
const router = express.Router();
const { getDatabaseStatus } = require('../config/db');

router.get('/health', (req, res) => {
  const db = getDatabaseStatus();
  const statusCode = db.isConnected ? 200 : 503;
  res.status(statusCode).json({
    status: db.isConnected ? 'success' : 'degraded',
    message: db.isConnected
      ? 'Government Scheme Finder API is operational'
      : 'Database connection is degraded or disconnected',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: db.state,
      readyState: db.readyState,
      mode: db.isInMemory ? 'in-memory (development fallback)' : 'external (MongoDB Atlas/Local)',
      name: db.name || 'none',
      host: db.host || 'none',
    },
    version: '1.0.0'
  });
});

module.exports = router;
