const AppError = require('./../utils/app-error');

const castErrorHandler = (err) => {
  const message = `Invalid value: ${err.value} for ${err.path}`;
  return new AppError(message, 400);
};
const validationErrorHandler = err => {
  const error = Object.values(err.errors).map(({properties}) => `${properties.path} : ${properties.message}`);
  return new AppError(error.join(' '), 400);
}
const devError = (err, res) => {
  const { status, statusCode, message, stack } = err;
  return res.status(statusCode || 500).json({
    status: status || 'ERROR',
    message: message,
    err: err,
    stack: stack,
  });
};
const prodError = (err, res) => {
  if (err.isOpperational) {
    const { status, statusCode, message } = err;
    return res.status(statusCode).json({
      status: status || 'ERROR',
      message: message,
    });
  } else {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong.',
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    if (err.name === 'CastError') error = castErrorHandler(err);
    if (err.name === 'ValidationError') error = validationErrorHandler(err);
    prodError(error, res);
  }
};
