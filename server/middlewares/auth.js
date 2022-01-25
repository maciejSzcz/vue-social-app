import passport from 'passport';

export default (req, res, next) => {
  return passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/api/auth/failure',
  })(req, res, next);
};
