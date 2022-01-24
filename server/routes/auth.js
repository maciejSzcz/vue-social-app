import { Router } from 'express';
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

  api.post('/register', AuthController.register);

  api.get('/currentUser', [jwtAuth], AuthController.getCurrentUser);

  return api;
};
