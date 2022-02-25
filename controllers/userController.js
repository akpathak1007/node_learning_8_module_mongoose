const User = require('../models/User');
const success = require('../utils/success-message');

// Todo: Create New user
exports.new_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
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
    message: 'this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Update user
exports.update_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Delete user
exports.delete_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};