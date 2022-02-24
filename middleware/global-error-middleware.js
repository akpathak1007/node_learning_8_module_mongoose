const AppError = require('./../utils/app-error');
const error = require('../utils/app-error');

const castErrorHandler = (err) => {
  const message = `Invalid value: ${err.value} for ${err.path}`;
  return error(message, 400);
};
const validationErrorHandler = err => {
  const error = Object.values(err.errors).map(({properties}) => `${properties.path} : ${properties.message}`);
  return error(error.join(' '), 400);
}
const devError = (err, res) => {
  const { status, statusCode, message, stack, data, isOpperational } = err;
  return res.status(statusCode || 500).json({
    status: status || 'ERROR',
    statusCode,
    isOpperational,
    message: message,
    data,
    err: err,
    stack: stack,
  });
};
const prodError = (err, res) => {
  if (err.isOpperational) {
    const { status, statusCode, message, data, } = err;
    return res.status(statusCode).json({
      status: status || 'ERROR',
      statusCode,
      message: message,
      data
    });
  } else {
    return res.status(500).json({
      status: 'ERROR',
      statusCode: 500,
      message: 'Something went wrong.',
      data: null
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err);
    let error = null;
    if (err.name === 'CastError') error = castErrorHandler(err);
    if (err.name === 'ValidationError') error = validationErrorHandler(err);
    prodError(error || err, res);
  }
};
