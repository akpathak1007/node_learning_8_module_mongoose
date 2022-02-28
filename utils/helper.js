const jwt = require('jsonwebtoken');

/**
 * Method to create token and add user id to payload.
 */
exports.signToken = async (userId) => {
  return await jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};
