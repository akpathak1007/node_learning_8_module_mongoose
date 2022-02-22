module.exports = (err, req, res, next) => {
  const { status, statusCode, message } = err;
  return res.status(statusCode || 500).json({
    status: status || 'error',
    message: message,
  });
};
