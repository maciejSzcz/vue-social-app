import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default {
  async login(req, res, next) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    return res.send({ token });
  },

  async register(req, res, next) {
    const { first_name, last_name, email, password } = req.body;
    const user = new User({ first_name, last_name, email });
    await User.register(user, password);

    res.status(201).send({ message: 'User created successfully' });
  },
};
