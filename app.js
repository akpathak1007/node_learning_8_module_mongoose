const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;