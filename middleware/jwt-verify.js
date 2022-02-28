const error = require('../utils/app-error');
const jwt =  require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

const User = require('../models/User');

/**
 * It is middleware which verify where there is token available in the request or not.
 * It verifies if the token has expired or not. if expired then send error message to user.
 * Checks if users is still exist or not.
 * Alter a request object add _id and user property.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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
    const user = await User.findById(_id).select('+password');
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
