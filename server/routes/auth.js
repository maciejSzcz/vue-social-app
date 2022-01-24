import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import AuthController from '../controllers/authController.js';
import passport from 'passport';
import jwtAuth from '../middlewares/auth.js';

export default () => {
  const api = Router();

  api.post(
    '/login',
    passport.authenticate('local', { session: false }),
    AuthController.login
  );

  api.post('/register', catchAsync(AuthController.register));

  api.get('/currentUser', [jwtAuth], AuthController.getCurrentUser);

  return api;
};
