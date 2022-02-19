const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.route('/tour-stat').get(tourController.get_tours_statistics);
router.route('/monthly-plan/:year').get(tourController.get_monthly_plan);
router
  .route('/')
  .get(tourController.get_all_tours)
  .post(tourController.create_tour);
router
  .route('/:id')
  .get(tourController.get_single_tour)
  .patch(tourController.update_tour)
  .delete(tourController.delete_tour);

module.exports = router;
