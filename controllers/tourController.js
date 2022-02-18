const { json } = require('express/lib/response');
const Tour = require('../models/Tour');

/**
 * Create a tour
 */
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
/**
 *  Get all tours
 */
exports.get_all_tours = async (req, res) => {
  try {
    const count = await Tour.countDocuments();
    // todo: 1A. Filtering
    let query = { ...req.query };
    const willRemove = ['sort', 'page', 'limit', 'fields'];
    willRemove.forEach(el => delete query[el]);
    
    // todo: 1B. Advance Filtering
    query = JSON.stringify(query).replace(/\b(gte|lt|gt|lte)\b/g, match => `$${match}`);
    query = Tour.find(JSON.parse(query));
    // Tour.find().where('duration').lte(5).where('difficulty').equals('easy')
    
    // todo: 2 SORTING
    if (req.query.sort) {
      let sortQuery = req.query.sort;
      sortQuery = sortQuery.replace(',', ' ');
      console.log(sortQuery);
      query = query.sort(sortQuery);
    } else {
      query = query.sort('-createdAt')
    }

    // todo: 3. limiting data fields
    if (req.query.fields) {
      const fields = req.query.fields.replace(/[,]/g, ' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // todo: 4. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit; 
    if (skip >= count) {
      throw { message: 'No data found.' };
    }
    query.skip(skip).limit(limit);



    const tours = await query;
    res.status(200).json({
      status: 'success',
      result: count,
      data: {
        tours,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'FAIL',
      message: err.message,
    });
  }
};
/**
 *  Delete tour
 */
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
      message: err.message
    })
  }
};
/**
 * Get a single tours
 */
exports.get_single_tour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    console.log(tour);
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
/**
 * Update a tour
 */
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
