const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Defining User Modal Schema
 */
const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
    maxLength: 50,
    minLength: 3,
  },
  email: {
    required: true,
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Please enter valid email.'],
  },
  password: {
    required: true,
    type: String,
    select: false,
    minLength: 6,
  },
  confirmPassword: {
    required: true,
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password ? true : false;
      },
      message: 'Confirm password must match with password.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    select: false,
    default: true
  }
});
/**
 * Query Middleware to make projection off of active field.
 */
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
})
/**
 * Document Middleware to adding a field to document when the password has changed.
 */
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
})
/**
 * Document Middleware to encrypt the password.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
/** 
 * To compare a old user's password with new one.
 */
userSchema.method(
  'comparePassword',
  async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
);
/**
 * Create reset password token.
 */
userSchema.method('getRestPasswordToken', function (){
  const resetToken = crypto.randomBytes(30).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
});
const User = mongoose.model('User', userSchema);

module.exports = User;
