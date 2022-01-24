import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import postsController from '../controllers/postsController.js';
import jwtAuth from '../middlewares/auth.js';
import isSelf from '../middlewares/isSelf.js';
import isFriends from '../middlewares/isFriends.js';
import setPublicity from '../middlewares/setPublicity.js';

export default () => {
  const api = Router();

  api.get('/', catchAsync(postsController.findAllPublicPosts));

  api.post(
    '/:id/private',
    [jwtAuth, isSelf, setPublicity('privatePosts')],
    catchAsync(postsController.addPost)
  );

  api.post(
    '/:id/public',
    [jwtAuth, isSelf, setPublicity('publicPosts')],
    catchAsync(postsController.addPost)
  );

  api.post(
    '/:id',
    [jwtAuth, isSelf, setPublicity('general')],
    catchAsync(postsController.addPost)
  );

  api.get(
    '/:id',
    [jwtAuth, isFriends],
    catchAsync(postsController.findPostsForUser)
  );

  return api;
};
