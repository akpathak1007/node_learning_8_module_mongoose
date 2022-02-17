const express = require('express');
const userController = require('./../controllers/userController');


const userRouter = express.Router();


userRouter.route('/').get(userController.get_all_users).post(userController.new_user);
userRouter
  .route('/:id')
  .get(userController.get_single_user)
  .patch(userController.update_user) 
  .delete(userController.delete_user);

module.exports = userRouter;


