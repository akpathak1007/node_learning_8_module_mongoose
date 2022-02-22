class ErrorHandle extends Error{
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'FAIL': 'ERROR';
    this.isOpperational = true;
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ErrorHandle;