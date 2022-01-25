import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '../models/User.js';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

function verifyCallback(payload, done) {
  return User.findOne({ _id: payload.id })
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
}

export default () => {
  const config = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(User.createStrategy(verifyCallback));
  passport.use(new JWTStrategy(config, verifyCallback));
};
