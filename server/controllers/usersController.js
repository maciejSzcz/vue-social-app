import User from '../models/User.js';

export default {
  async findAll(req, res) {
    const users = await User.find();

    return res.status(200).send({ data: users });
  },

  async findById(req, res, next) {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next();
    }
    return res.status(200).send({ data: user });
  },
};
