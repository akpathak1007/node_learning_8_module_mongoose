module.exports = (res, message, data=null, statusCode=200) => {
  return res.status(statusCode).json({
    status: 'SUCCESS',
    statusCode,
    message,
    data,
  })
}