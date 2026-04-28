/**
 * User Model
 * Returns the Mongoose model when MongoDB is connected,
 * or the in-memory store when running in fallback mode.
 *
 * Includes pre-save hook for automatic password hashing (Mongoose path).
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isInMemory } = require('../config/db');
const MemoryUser = require('../config/memoryStore');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

/**
 * Pre-save middleware
 * Hashes the password before saving if it has been modified
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare passwords
 * @param {string} candidatePassword - The password to compare
 * @returns {boolean} True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

let MongooseUser;
try {
  MongooseUser = mongoose.model('User');
} catch {
  MongooseUser = mongoose.model('User', userSchema);
}

/**
 * Proxy that returns MemoryUser when in-memory mode is active,
 * otherwise returns the real Mongoose model.
 */
const getUserModel = () => {
  if (isInMemory()) return MemoryUser;
  return MongooseUser;
};

// Export a Proxy so callers can do `User.findOne(...)` etc.
module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      const model = getUserModel();
      const val = model[prop];
      if (typeof val === 'function') return val.bind(model);
      return val;
    },
  }
);
