const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);

router.route('/').get(userController.get_all_users).post(userController.new_user);
router
  .route('/:id')
  .get(userController.get_single_user)
  .patch(userController.update_user) 
  .delete(userController.delete_user);

module.exports = router;


