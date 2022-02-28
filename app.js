const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const error = require('./utils/app-error');
const globalErrorCatch = require('./middleware/global-error-middleware');

const app = express();
app.use(express.static(`${__dirname}/public/`));
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
/* Rate limiting useing global middleware */
const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request please try again in an hour'
});
app.use('/api', limiter)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

/* Unhandled routes */
app.all('*', (req, res, next) => {
  next(error(`Can not find route ${req.originalUrl}`, 404));
});

app.use(globalErrorCatch);
module.exports = app;