const crypto = require('crypto');

const catchAsync = require('../utils/catch-async');
const User = require('../models/User');
const success = require('../utils/success-message');
const error = require('../utils/app-error');
const { forgetPassword } = require('../utils/send-email');
const { signToken } = require('../utils/helper');

/**
 * API patch updatePassword route handler
 * Update password when user is logged in.
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, confirmPassword, password, user } = req.body;
  const check = await user.comparePassword(currentPassword, user.password);
  if (!check) {
    console.log(check);
    return next(error('Permission Denied. Please enter valid password.', 401));
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();
  return success(res, 'Password updated successfully.');
});
/**
 * Reset Password Route Handler
 *
 * In this type of method we stored a reset token and a expire time in database.
 * When a user request to reset his password using forgetPassword API a token is send in email.
 *
 * If user make it to update password a passwordUpdatedAt field is create in database using middleware.
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  let { token } = req.params;
  /* Check if user token coming in the request is exist in database or not and make sure that it is not expired. */
  token = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpire: { $gt: new Date().toISOString() },
  });
  /* If no user found in the database send an error message */
  if (!user) {
    return next(error('Token may invalid or expired. Please try again'));
  }
  /* If user found reset his password with all validation */
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  /* Set password updated at property */
  await user.save();
  const jwtToken = await signToken(user._id);
  return success(res, 'Password has updated successfully.', {
    token: jwtToken,
  });
});
/**
 * Forget Password Functionality
 */
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(error('Email is required.'));
  const user = await User.findOne({ email: email });
  if (!user) return next('No user found with this email', 404);
  const resetToken = user.getRestPasswordToken();
  await user.save({ validateBeforeSave: false });
  await forgetPassword({
    to: user.email,
    name: user.name,
    resetToken,
  });
  return success(res, 'Verify email has sent.');
});
/**
 * Signin controller method.
 */
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(error('Password and Email must be given.'));
  }
  const user = await User.findOne({ email }).select('password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(error('Please enter valid password'));
  }
  const { _id } = user;
  const token = await signToken(_id);
  return success(res, 'Login in successfully.', { _id, token });
});
/**
 * Sign up controller method
 */
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });
  const token = await signToken(user._id);
  return success(res, 'User created successfully', { token, user });
});
