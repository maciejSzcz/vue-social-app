import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import passport from 'passport';

export default {
  async login(req, res, next) {
    return passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.status(404).json(err);
        }

        if (user) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
          });
          const foundUser = await User.findOne({ _id: user._id }).populate(
            'posts'
          );

          return res.send({ token, user: foundUser });
        } else {
          return res.status(401).json(info);
        }
      }
    )(req, res, next);
  },

  async register(req, res, next) {
    const { first_name, last_name, email, password } = req.body;
    const user = new User({ first_name, last_name, email });
    const registeredUser = await User.register(user, password);

    if (!registeredUser) {
      return next();
    }

    passport.authenticate('local', { session: false })(req, res, () => {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60,
      });

      res.status(201).send({ token, user: registeredUser });
    });
  },

  async getCurrentUser(req, res, next) {
    const user = await User.findOne({ _id: req.user._id }).populate('posts');
    return res.send({ data: user });
  },

  async getAuthErrorMessage(req, res, next) {
    return res.status(401).send({ message: 'User unauthorized' });
  },
};
