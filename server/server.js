/**
 * CyberShield — Express Server Entry Point
 * Backend API Server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Enable CORS for all domains
app.use(cors({
  origin: "*"
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// API Routes
// ============================================

// Root Route
app.get('/', (req, res) => {
  res.send('Backend running successfully 🚀');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CyberShield API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// ============================================
// 404 Handler for Unknown Routes
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
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
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🛡️  CyberShield Server running on port ${PORT}`);
      console.log(`🔧  Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
