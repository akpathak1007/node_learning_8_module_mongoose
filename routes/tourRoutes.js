const express = require('express');
const tourController = require('./../controllers/tourController')
const router = express.Router();

router.param('id', tourController.checkId);

router.route('/').get(tourController.get_all_tours).post( tourController.checkBody ,tourController.new_tour);
router
  .route('/:id')
  .get(tourController.get_single_tour)
  .patch(tourController.update_tour)
  .delete(tourController.delete_tour);

module.exports = router;
