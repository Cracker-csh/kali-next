/**
 * Dashboard Routes
 * Protected routes that require authentication
 * Provides user profile data and dummy analytics
 */

const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/dashboard/profile
 * @desc    Get current user's profile
 * @access  Private (requires JWT)
 */
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
});

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dummy dashboard statistics
 * @access  Private (requires JWT)
 */
router.get('/stats', protect, async (req, res) => {
  try {
    // Dummy analytics data for demonstration
    const stats = {
      threatsStopped: 1247,
      activeScans: 3,
      vulnerabilities: {
        critical: 2,
        high: 5,
        medium: 12,
        low: 23,
      },
      networkTraffic: {
        inbound: '2.4 GB',
        outbound: '1.1 GB',
        suspicious: 7,
      },
      recentAlerts: [
        {
          id: 1,
          type: 'warning',
          message: 'Unusual login attempt detected from 192.168.1.105',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: 2,
          type: 'critical',
          message: 'Potential SQL injection blocked on /api/search',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          id: 3,
          type: 'info',
          message: 'SSL certificate renewed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        {
          id: 4,
          type: 'warning',
          message: 'Port scan detected from external IP 45.33.32.156',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
        {
          id: 5,
          type: 'info',
          message: 'Firewall rules updated — 3 new rules applied',
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        },
      ],
      securityScore: 87,
      uptime: '99.97%',
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
    });
  }
});

module.exports = router;
