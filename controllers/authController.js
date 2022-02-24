const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catch-async');
const User = require('../models/User');

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.status(200).json({
    message: 'User created successfully',
    token,
    data: user,
  });
});
