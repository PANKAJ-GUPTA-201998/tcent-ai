const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema for Authentication
 * Stores basic user info + hashed password
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      default: 'User',
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: false, // OAuth users don't set a password
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default in queries
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'linkedin'],
      default: 'local',
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    linkedinId: {
      type: String,
      default: null,
      sparse: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },

    // ── Subscription ──────────────────────────────────────────
    subscription: {
      plan: {
        type: String,
        enum: ['starter', 'pro', 'premium'],
        default: null,
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: null,
      },
      startDate: { type: Date, default: null },
      endDate:   { type: Date, default: null },
      amount:    { type: Number, default: null },   // INR
      autoRenew: { type: Boolean, default: false },
    },

    // ── Payment History ───────────────────────────────────────
    paymentHistory: [
      {
        orderId:   { type: String, required: true },
        paymentId: { type: String, default: '' },
        amount:    { type: Number, required: true },  // INR
        planName:  { type: String, required: true },
        status: {
          type: String,
          enum: ['paid', 'failed', 'refunded'],
          required: true,
        },
        paidAt: { type: Date, default: Date.now },
        method: { type: String, default: '' },        // card, upi, netbanking…
      },
    ],
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

/**
 * IMPORTANT: Middleware to hash password before saving
 * This runs automatically when user.save() is called
 */
userSchema.pre('save', async function (next) {
  // Only hash if password exists and was modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare entered password with hashed password
 * Usage: const isMatch = await user.comparePassword('password123');
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method to get public user data (without password)
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
