const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catch-async');
const User = require('../models/User');
const success = require('../utils/success-message');
const error = require('../utils/app-error');
const { use } = require('express/lib/router');
/**
 * ? Forget Password Functionality
 */
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(error('Email is required.'));
  const user = await User.findOne({ email: email });
  if (!user) return next('No user found with this email', 404);
  const resetToken  = user.getRestPasswordToken();  
  await user.save({validateBeforeSave: false})

  return success(res, "Verify email has sent.");
});
/**
 * ? Method to create token and add user id to payload.
 */
const signToken = async (userId) => {
  return await jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};
/**
 * ? Signin controller method.
 */
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(error('Password and Email must be given.'));
  }
  const user = await User.findOne({ email }).select('password');
  if (!user || ! await user.comparePassword(password, user.password)) {
    return next(error('Please enter valid password'));
  }
  const { _id } = user;
  const token = await signToken(_id);
  return success(res, 'Login in successfully.', { _id, token });
});
/**
 * ? Sign up controller method
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
