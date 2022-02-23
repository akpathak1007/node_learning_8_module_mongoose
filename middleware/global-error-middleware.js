const { exists } = require("../models/Tour");

const devError = (err, res) => {
  const { status, statusCode, message, stack } = err;
  return res.status(statusCode||500).json({
    status: status || 'ERROR',
    message: message,
    err: err,
    stack: stack,
  });
};
const prodError = (err, res) => {
  const { status, statusCode, message, isOpperational } = err;
  if (isOpperational) {
    return res.status(statusCode).json({
      status: status || 'ERROR',
      message: message,
    });
  } else {
    console.error(err);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong.',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err);
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    prodError(err, res);
  }
};
