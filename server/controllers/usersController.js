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

    if (req.user) {
      const isFriend = await User.findOne({
        _id: req.params.id,
        friends: req.user.id,
      });

      if (isFriend) {
        const updatedUser = {
          ...user.toObject(),
          isFriend: true,
        };
        return res.status(200).send({ data: updatedUser });
      }
    }

    const updatedUser = {
      ...user.toObject(),
      isFriend: false,
    };
    return res.status(200).send({ data: updatedUser });
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
    const user = await User.findOne({ _id: req.user.id }).populate('friends');
    const friend = await User.findOne({ _id: req.params.id }).populate(
      'friends'
    );

    if (!user || !friend) {
      return next();
    }

    const currentUserInUserRequestList = await User.findOne({
      _id: req.params.id,
      friendsRequest: req.user.id,
    });

    const currentUserInUserFriendsList = await User.findOne({
      _id: req.params.id,
      friends: req.user.id,
    });

    const userInCurrentUserFriendRequestsList = await User.findOne({
      _id: req.user.id,
      friendsRequest: req.params.id,
    });

    console.log('in user request list', currentUserInUserRequestList);
    console.log('in user friends list', currentUserInUserFriendsList);
    console.log('in friends request list', userInCurrentUserFriendRequestsList);

    if (currentUserInUserRequestList) {
      return res
        .status(400)
        .send({ message: 'You have already sent a friends request' });
    }

    if (!currentUserInUserFriendsList && !userInCurrentUserFriendRequestsList) {
      const updatedFriend = await friend.updateOne({
        $push: { friendsRequest: user },
      });

      if (!updatedFriend) {
        return res.status(500).send({
          message: 'Error occurred while sending a friend request ',
          err,
        });
      }

      return res
        .status(201)
        .send({ message: 'Successfully sent a friend request' });
    }

    if (userInCurrentUserFriendRequestsList && !currentUserInUserFriendsList) {
      const updatedUser = user.updateOne({
        $push: { friends: friend },
        $pull: { friendsRequest: req.params.id },
      });
      const updatedFriend = friend.updateOne({
        $push: { friends: user },
      });

      const [savedUser, savedFriend] = await Promise.all([
        updatedUser,
        updatedFriend,
      ]).catch((err) => {
        return res
          .status(500)
          .send({ message: 'Error occurred while adding friend ', err });
      });

      return res.status(201).send({ data: { savedUser, savedFriend } });
    }
    return res.status(400).send({ message: 'User is already your friend' });
  },

  async deleteFriend(req, res, next) {
    const user = await User.findOne({ _id: req.user.id });
    const friend = await User.findOne({ _id: req.params.id });

    if (!user || !friend) {
      return next();
    }

    const updatedUser = user.updateOne({
      $pull: { friends: req.params.id, friendsRequest: req.params.id },
    });
    const updatedFriend = friend.updateOne({
      $pull: { friends: req.user.id, friendsRequest: req.user.id },
    });

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
