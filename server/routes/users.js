import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import usersController from '../controllers/usersController.js';
import jwtAuth from '../middlewares/auth.js';

export default () => {
  const api = Router();

  api.get('/', catchAsync(usersController.findAll));
  api.get('/:id', jwtAuth, catchAsync(usersController.findById));

  /* api.put('/:id', jwtAuth, catchAsync(userController.update));
  api.delete('/:id', jwtAuth, catchAsync(userController.delete)); */

  return api;
};
