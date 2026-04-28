/**
 * Database Configuration
 * Attempts to connect to MongoDB. Falls back to in-memory mode if unavailable.
 */

const mongoose = require('mongoose');

let useInMemory = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // If no URI configured, use in-memory mode
  if (!uri) {
    console.log('⚠️  No MONGO_URI set — running in IN-MEMORY mode');
    useInMemory = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB isn't available
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB unavailable (${error.message})`);
    console.log('📦 Falling back to IN-MEMORY mode — data will not persist across restarts');
    useInMemory = true;
  }
};

const isInMemory = () => useInMemory;

module.exports = connectDB;
module.exports.isInMemory = isInMemory;
