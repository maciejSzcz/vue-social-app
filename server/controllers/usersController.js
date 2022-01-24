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

  async updateById(req, res, next) {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next();
    }
    const updatedUser = await user.updateOne(req.params.body).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while updating user ', err });
    });

    return res.status(200).send({ data: updatedUser });
  },

  async addFriend(req, res, next) {
    const user = await User.findOne({ _id: req.params.id });
    const friend = await User.findOne({ _id: req.body.id });

    if (!user || !friend) {
      return next();
    }

    const updatedUser = user.updateOne({ $push: { friends: friend } });
    const updatedFriend = friend.updateOne({ $push: { friends: user } });

    const [savedUser, savedFriend] = await Promise.all([
      updatedUser,
      updatedFriend,
    ]).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while adding friend ', err });
    });

    return res.status(201).send({ data: { savedUser, savedFriend } });
  },

  async deleteFriend(req, res, next) {
    const user = await User.findOne({ _id: req.params.id });
    const friend = await User.findOne({ _id: req.body.id });

    if (!user || !friend) {
      return next();
    }

    const updatedUser = user.updateOne({ $pull: { friends: friend } });
    const updatedFriend = friend.updateOne({ $pull: { friends: user } });

    const [savedUser, savedFriend] = await Promise.all([
      updatedUser,
      updatedFriend,
    ]).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while removing friend ', err });
    });

    return res.status(201).send({ data: { savedUser, savedFriend } });
  },
};
