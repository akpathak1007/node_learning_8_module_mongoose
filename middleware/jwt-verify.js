const error = require('../utils/app-error');
const jwt =  require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

const catchAsync = require('../utils/catch-async');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    /* Check if authorization header is set or not */
    let auth = req.headers.authorization;
    /* check if it is jwt token */
    let token = auth && auth.startsWith('Bearer') ? auth.split(' ')[1] : '';
    if (!token) {
      return next(error('You are not logged in.'));
    }
    /* verify the token */
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    /* check user if it exists or not */
    const user = await User.findById(_id);
    if (!user) {
      return next(error('Permission denied.', 404));
    }
    req.body._id = _id;
    req.body.user = user;
    /* check password is updated after or not */
    next();
  } catch (err) {
    let message = err.message;
    if (err instanceof TokenExpiredError)
      message = 'Session has expired. Please Login again.';
    else if (err instanceof JsonWebTokenError) message = 'Invalid JWT token.';
    next(error(message));
  }
};
