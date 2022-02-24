const { json } = require('express/lib/response');
const Tour = require('../models/Tour');
const APIFeatures = require('./../utils/APIFeatures.js');

exports.get_monthly_plan = async (req, res) => {
  const year = req.params.year * 1;
  try {
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
          tours: {$push: '$name'}
        }
      },
      {
        $addFields: {
          month: '$_id'
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTours: -1 }
      },
      {
        $limit: 12
      }
    ]);
    return res.status(200).json({
      status: 'SUCCESS',
      data: {
        plan,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'FIALED',
      message: err.message,
    });
  }
};
exports.get_tours_statistics = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(400).json({
      status: 'FIALED',
      message: err.message,
    });
  }
};
/** Create a tour */
exports.create_tour = async (req, res) => {
  try {
    const body = req.body;
    const tour = await Tour.create(body);
    return res.status(201).json({
      result: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'FAIL',
      message: err.message,
    });
  }
};
/** Get all tours */
exports.get_all_tours = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(400).json({
      status: 'FAIL',
      message: err.message,
    });
  }
};
/**  Delete tour*/
exports.delete_tour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    return res.status(204).json({
      status: 'SUCCESS',
      data: null,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'FIALED',
      message: err.message,
    });
  }
};
/** Get a single tours */
exports.get_single_tour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'FAIL',
      message: err.message,
    });
  }
};
/** Update a tour */
exports.update_tour = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Update successfully.',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(412).json({
      status: 'ERROR',
      message: err.message,
      data: null,
    });
  }
};
