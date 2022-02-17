const express = require('express');

const userRouter = express.Router();

// Todo: Create New user
const new_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Get all users
const get_all_users = (req, res) => {
  return res.status(200).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Get a single user
const get_single_user = (req, res) => {
  return res.status(200).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Update user
const update_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};
// Todo: Delete user
const delete_user = (req, res) => {
  return res.status(201).json({
    status: 'SUCCESS',
    message: 'this route is not implemeted yet.',
    data: null,
  });
};

userRouter.route('/').get(get_all_users).post(new_user);
userRouter
  .route('/:id')
  .get(get_single_user)
  .patch(update_user)
  .delete(delete_user);

module.exports = userRouter;


