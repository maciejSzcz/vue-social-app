import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import _postsController from '../controllers/postsController.js';
import jwtAuth from '../middlewares/auth.js';
import isSelf from '../middlewares/isSelf.js';
import isFriends from '../middlewares/isFriends.js';
import setPublicity from '../middlewares/setPublicity.js';

export default (io) => {
  const api = Router();
  const postsController = _postsController(io);

  api.get('/publicPosts', catchAsync(postsController.findAllPublicPosts));

  api.get(
    '/privatePosts',
    [jwtAuth],
    catchAsync(postsController.findAllPrivatePosts)
  );

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
    '/user/:id',
    [jwtAuth, isFriends],
    catchAsync(postsController.findPostsForUser)
  );

  api.get(
    '/user/:id/public',
    setPublicity('publicPosts'),
    catchAsync(postsController.findPostsForUserWithPublicity)
  );

  api.get(
    '/user/:id/private',
    [jwtAuth, isFriends, setPublicity('privatePosts')],
    catchAsync(postsController.findPostsForUserWithPublicity)
  );

  api.get(
    '/:id',
    [jwtAuth, isFriends],
    catchAsync(postsController.getPostById)
  );

  api.get(
    '/:id/publicPosts',
    [jwtAuth, isFriends, setPublicity('publicPosts')],
    catchAsync(postsController.getPostByIdWithPublicity)
  );

  api.get(
    '/:id/privatePosts',
    [jwtAuth, isFriends, setPublicity('privatePosts')],
    catchAsync(postsController.getPostByIdWithPublicity)
  );

  return api;
};
