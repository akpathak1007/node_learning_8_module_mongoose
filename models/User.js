const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});
/* To compare a old user's password with new one */
userSchema.method(
  'comparePassword',
  async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
);
/* Create reset password token */
userSchema.method('getRestPasswordToken', async function (){
  console.log(this);
  const resetToken = crypto.randomBytes(30).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 + 1000;
  console.log( resetToken ,this.passwordResetToken);
  
  return resetToken;
});
const User = mongoose.model('User', userSchema);

module.exports = User;
