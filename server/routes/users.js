import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import usersController from '../controllers/usersController.js';
import jwtAuth from '../middlewares/auth.js';
import isSelf from '../middlewares/isSelf.js';

export default () => {
  const api = Router();

  api.get('/', catchAsync(usersController.findAll));

  api.get('/:id', jwtAuth, catchAsync(usersController.findById));

  api.put('/:id', jwtAuth, catchAsync(usersController.updateById));

  api.post(
    '/:id/friends',
    [jwtAuth, isSelf],
    catchAsync(usersController.addFriend)
  );

  api.delete(
    '/:id/friends',
    [jwtAuth, isSelf],
    catchAsync(usersController.deleteFriends)
  );

  return api;
};
