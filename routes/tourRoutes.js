const express = require('express');
const tourController = require('./../controllers/tourController')
const tourRouter = express.Router();

tourRouter.route('/').get(tourController.get_all_tours).post(tourController.new_tour);
tourRouter
  .route('/:id')
  .get(tourController.get_single_tour)
  .patch(tourController.update_tour)
  .delete(tourController.delete_tour);

module.exports = tourRouter;
