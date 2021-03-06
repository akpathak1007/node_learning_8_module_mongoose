const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const error = require('./utils/app-error');
const globalErrorCatch = require('./middleware/global-error-middleware');

const app = express();
/* Helmet middleware */
app.use(helmet());
/* Static middleware to server static files */
app.use(express.static(`${__dirname}/public/`));
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
/* Global middleware to parse body into json */
app.use(express.json({ limit: '10kb' }));
/* Data sanitization against NoSQL injection*/
app.use(mongoSanitize());
/*  Data sanitization against XSS*/
app.use(xss());
/* Prevent parameter pollution */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
/* Rate limiting useing global middleware */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request please try again in an hour',
});
app.use('/api', limiter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

/* Unhandled routes */
app.all('*', (req, res, next) => {
  next(error(`Can not find route ${req.originalUrl}`, 404));
});

app.use(globalErrorCatch);
module.exports = app;
