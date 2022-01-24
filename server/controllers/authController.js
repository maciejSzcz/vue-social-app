import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default {
  async login(req, res, next) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });
    const user = await User.findOne({ _id: req.user._id }).populate('posts');

    return res.send({ token, user });
  },

  async register(req, res, next) {
    const { first_name, last_name, email, password } = req.body;
    const user = new User({ first_name, last_name, email });
    await User.register(user, password);

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });
    const registeredUser = await User.findOne({ _id: req.user._id }).populate(
      'posts'
    );

    res.status(201).send({ token, user: registeredUser });
  },

  async getCurrentUser(req, res, next) {
    const user = await User.findOne({ _id: req.user._id }).populate('posts');
    return res.send({ data: user });
  },
};
