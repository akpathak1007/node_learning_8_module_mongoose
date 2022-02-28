const User = require('../models/User');
const catchAsync = require('../utils/catch-async');
const success = require('../utils/success-message');
const { reqFilter } = require('../utils/helpers');
const { findByIdAndUpdate } = require('../models/User');

/**
 * Soft delete an user
 */
exports.delete_me = catchAsync(async (req, res, next) => {
  const { _id } = req.body;
  const user = await User.findByIdAndUpdate(_id, { active: false });
  success(res, 'User delete successfully', user);
})
/**
 * Updating user details except password
 */
exports.update_me = catchAsync(async (req, res, next) => {
  const { _id, user } = req.body;
  const body = reqFilter(req.body, 'name');
  updateUser = await User.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true
  });
  return success(res, 'User updaed successfully.', updateUser);
});
// Todo: Create New user
exports.new_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'new_user this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Get all users
exports.get_all_users = async (req, res) => {
  const users  = await User.find();
  success(res, 'User found successfully.' ,users);
};
// Todo: Get a single user
exports.get_single_user = (req, res) => {
  return res.status(200).json({
    status: 'SUCCESS',
    message: 'get_all_users this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Update user
exports.update_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'update_user this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Delete user
exports.delete_user = (req, res) => {
  
  return res.status(201).json({
    status: 'SUCCESS',
    message: ' delete_user this route is not implemeted yet.',
    data: null,
  });
};