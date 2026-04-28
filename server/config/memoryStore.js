/**
 * In-Memory Data Store
 * Provides a Map-based user store that mimics Mongoose model methods
 * Used as fallback when MongoDB is unavailable
 */

const bcrypt = require('bcryptjs');

// In-memory users map (keyed by a unique ID)
const users = new Map();
let idCounter = 1;

/**
 * Generate a fake ObjectId-like string
 */
const generateId = () => {
  const hex = (idCounter++).toString(16).padStart(24, '0');
  return hex;
};

/**
 * In-memory User "model" — mimics the Mongoose interface
 */
const MemoryUser = {
  /**
   * Create a new user
   */
  async create({ fullName, email, password }) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const now = new Date();
    const user = {
      _id: generateId(),
      fullName,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: 'user',
      lastLogin: null,
      createdAt: now,
      updatedAt: now,
    };

    users.set(user._id, user);

    // Return a copy without password (mimics select: false)
    const { password: _, ...safe } = user;
    safe.comparePassword = async (candidate) =>
      bcrypt.compare(candidate, hashed);
    safe.save = async () => {
      // Sync mutations back
      const stored = users.get(safe._id);
      if (stored) {
        stored.lastLogin = safe.lastLogin;
        stored.updatedAt = new Date();
      }
    };
    return safe;
  },

  /**
   * Find one user by query. Supports chained .select('+password')
   */
  findOne(query) {
    let found = null;

    for (const user of users.values()) {
      let match = true;
      for (const [key, val] of Object.entries(query)) {
        if (user[key] !== val) {
          match = false;
          break;
        }
      }
      if (match) {
        found = user;
        break;
      }
    }

    // Return a thenable with a .select() method
    const result = {
      _found: found,
      select(fields) {
        // If '+password' is requested, include password in the returned object
        if (fields.includes('+password') && this._found) {
          const copy = { ...this._found };
          copy.comparePassword = async (candidate) =>
            bcrypt.compare(candidate, copy.password);
          copy.save = async (opts) => {
            const stored = users.get(copy._id);
            if (stored) {
              stored.lastLogin = copy.lastLogin;
              stored.updatedAt = new Date();
            }
          };
          this._found = copy;
        } else if (this._found) {
          const { password: _, ...safe } = this._found;
          this._found = safe;
        }
        return this;
      },
      then(resolve, reject) {
        resolve(this._found);
      },
    };

    return result;
  },

  /**
   * Find by ID — used by auth middleware
   */
  findById(id) {
    const user = users.get(id) || null;

    const result = {
      _found: user,
      select(fields) {
        if (this._found && fields.includes('-password')) {
          const { password: _, ...safe } = this._found;
          this._found = safe;
        }
        return this;
      },
      then(resolve) {
        resolve(this._found);
      },
    };

    return result;
  },
};

module.exports = MemoryUser;
