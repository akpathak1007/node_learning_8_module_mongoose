class AppError extends Error{
  constructor(message, statusCode, data) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'FAIL': 'ERROR';
    this.isOpperational = true;
    this.data = data;
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = (message, statusCode = 400, data = null) => {
  return new AppError(message, statusCode, data);
};