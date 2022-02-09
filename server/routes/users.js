import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import _usersController from '../controllers/usersController.js';
import jwtAuth from '../middlewares/auth.js';
import isSelf from '../middlewares/isSelf.js';

export default (io) => {
  const api = Router();
  const usersController = _usersController(io);

  api.get('/', catchAsync(usersController.findAll));

  api.get(
    '/authorized',
    jwtAuth,
    catchAsync(usersController.findAllAuthorized)
  );
  api.get('/friends', jwtAuth, catchAsync(usersController.findAllFriends));

  api.get('/:id/public', catchAsync(usersController.findById));

  api.get('/:id', jwtAuth, catchAsync(usersController.findById));

  api.put('/:id', [jwtAuth, isSelf], catchAsync(usersController.updateById));

  api.post('/:id/friends', jwtAuth, catchAsync(usersController.addFriend));

  api.delete('/:id/friends', jwtAuth, catchAsync(usersController.deleteFriend));

  return api;
};
