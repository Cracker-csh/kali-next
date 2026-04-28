/**
 * CyberShield — Express Server Entry Point
 * Sets up middleware, routes, and serves the frontend SPA
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================

// Enable CORS for development
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (if built)
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// ============================================
// API Routes
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// ============================================
// Health Check
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CyberShield API is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// SPA Fallback — serve index.html for all non-API routes
// ============================================

app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  }
});

// ============================================
// Global Error Handler
// ============================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ============================================
// Start Server
// ============================================

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🛡️  CyberShield Server running on http://localhost:${PORT}`);
    console.log(`📁  Serving frontend from: ${path.join(__dirname, '..', 'client')}`);
    console.log(`🔧  Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer();
