import { Router } from 'express';
import { catchAsync } from '../middlewares/errors.js';
import AuthController from '../controllers/authController.js';
import jwtAuth from '../middlewares/auth.js';

export default () => {
  const api = Router();

  api.post('/login', catchAsync(AuthController.login));

  api.post('/register', catchAsync(AuthController.register));

  api.all('/failure', AuthController.getAuthErrorMessage);

  api.get('/currentUser', [jwtAuth], AuthController.getCurrentUser);

  return api;
};
