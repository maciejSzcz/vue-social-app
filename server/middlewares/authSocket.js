import jwtAuth from 'socketio-jwt-auth';
import User from '../models/User.js';

export default () =>
  jwtAuth.authenticate(
    {
      secret: process.env.JWT_SECRET,
    },
    (payload, done) => {
      User.findOne({ id: payload.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, 'User not found');
        }
        return done(null, user);
      });
    }
  );
