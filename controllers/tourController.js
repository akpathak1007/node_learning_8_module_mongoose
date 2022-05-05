const { json } = require('express/lib/response');
const Tour = require('../models/Tour');
const APIFeatures = require('../utils/api-features.js');
const catchAsync = require('../utils/catch-async');
const error = require('../utils/app-error');

exports.get_monthly_plan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  return res.status(200).json({
    status: 'SUCCESS',
    data: {
      plan,
    },
  });
});
exports.get_tours_statistics = catchAsync(async (req, res) => {
  const tour = await Tour.aggregate([
    {
      $match: {
        ratingAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        totalTours: { $sum: 1 },
        averageRating: { $avg: '$ratingAverage' },
        totalRating: { $sum: '$ratingQuantity' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: { agvPrice: -1 },
    },
  ]);
  return res.status(200).json({
    status: 'SUCCESS',
    data: {
      tour,
    },
  });
});
/** Create a tour */
exports.create_tour = catchAsync(async (req, res, next) => {
  const body = req.body;
  const tour = await Tour.create(body);
  return res.status(201).json({
    result: 'success',
    data: {
      tour,
    },
  });
});
/** Get all tours */
exports.get_all_tours = catchAsync(async (req, res) => {
  const count = await Tour.countDocuments();
  const features = new APIFeatures(Tour.find(), req.query)
    .limitFields()
    .sort()
    .filter()
    .pagination();
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    result: features.counts,
    data: {
      tours,
    },
  });
});
/**  Delete tour*/
exports.delete_tour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    return next(error(`No data found with this ID.`, 404));
  }
  return res.status(204).json({
    status: 'SUCCESS',
    data: null,
  });
});
/** Get a single tours */
exports.get_single_tour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
    return next(error(`No data found with this ID.`, 404));
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
/** Update a tour */
exports.update_tour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const tour = await Tour.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(error(`No data found with this ID.`, 404));
  }
  return res.status(200).json({
    status: 'SUCCESS',
    message: 'Update successfully.',
    data: {
      tour,
    },
  });
});
