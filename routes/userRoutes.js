const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const jwtVerify = require('../middleware/jwt-verify');

const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.post('/forgetPassword', authController.forget_password);
router.patch('/resetPassword/:token', authController.reset_password);
router.patch('/updatePassword', jwtVerify, authController.update_password);
router.patch('/updateMe', jwtVerify, userController.update_me);
router.delete('/deleteMe', jwtVerify, userController.delete_me);

router
  .route('/')
  .get(userController.get_all_users)
  .post(userController.new_user);
router
  .route('/:id')
  .get(userController.get_single_user)
  .patch(userController.update_user)
  .delete(userController.delete_user);

module.exports = router;
