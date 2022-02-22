const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const ErrorHandle = require('./utils/error-handle');
const globalErrorCatch = require('./middleware/global-error-middleware');

const app = express();
app.use(express.static(`${__dirname}/public/`));
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

/* Unhandled routes */
app.all('*', (req, res, next) => {
  next(new ErrorHandle(`Can not find route ${req.originalUrl}`, 404));
});

app.use(globalErrorCatch);
module.exports = app;