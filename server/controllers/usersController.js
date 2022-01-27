import User from '../models/User.js';

export default {
  async findAll(req, res) {
    const users = await User.find();

    return res.status(200).send({ data: users });
  },

  async findAllAuthorized(req, res) {
    const users = await User.aggregate([
      {
        $set: {
          isFriend: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$friends',
                        as: 'friend',
                        cond: { $eq: ['$$friend', req.user._id] },
                      },
                    },
                  },
                  0,
                ],
              },
              true,
              false,
            ],
          },
          friendRequestCount: {
            $size: '$friendsRequest',
          },
        },
      },
      {
        $sort: {
          friendRequestCount: -1,
        },
      },
      {
        $project: {
          salt: 0,
          hash: 0,
          friendRequestCount: 0,
        },
      },
    ]);

    return res.status(200).send({ data: users });
  },

  async findById(req, res, next) {
    const user = await User.findOne({ _id: req.params.id }).populate('friends');
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

    const updatedUser = await user.updateOne(req.body).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while updating user ', err });
    });

    return res.status(200).send({ data: updatedUser });
  },

  async addFriend(req, res, next) {
    const currentUser = await User.findOne({ _id: req.user.id }).populate(
      'friends'
    );
    const otherUser = await User.findOne({ _id: req.params.id }).populate(
      'friends'
    );

    if (!currentUser || !otherUser) {
      return next();
    }

    const currentUserInOtherUserFriendRequestList = await User.findOne({
      _id: req.params.id,
      friendsRequest: req.user.id,
    });

    const currentUserInOtherUserFriendsList = await User.findOne({
      _id: req.params.id,
      friends: req.user.id,
    });

    const otherUserInCurrentUserFriendRequestsList = await User.findOne({
      _id: req.user.id,
      friendsRequest: req.params.id,
    });

    if (currentUserInOtherUserFriendRequestList) {
      return res
        .status(400)
        .send({ message: 'You have already sent a friends request' });
    }

    if (currentUserInOtherUserFriendsList) {
      return res.status(400).send({ message: 'User is already your friend' });
    }

    if (otherUserInCurrentUserFriendRequestsList) {
      const updatedUser = currentUser.updateOne({
        $push: { friends: otherUser },
        $pull: { friendsRequest: req.params.id },
      });
      const updatedOtherUser = otherUser.updateOne({
        $push: { friends: currentUser },
      });

      const [savedUser, savedOtherUser] = await Promise.all([
        updatedUser,
        updatedOtherUser,
      ]).catch((err) => {
        return res
          .status(500)
          .send({ message: 'Error occurred while adding friend ', err });
      });

      return res.status(201).send({ data: { savedUser, savedOtherUser } });
    }

    if (!currentUserInOtherUserFriendsList) {
      const updatedOtherUser = await otherUser.updateOne({
        $push: { friendsRequest: currentUser },
      });

      if (!updatedOtherUser) {
        return res.status(500).send({
          message: 'Error occurred while sending a friend request ',
          err,
        });
      }

      return res
        .status(201)
        .send({ message: 'Successfully sent a friend request' });
    }

    return res
      .status(500)
      .send({ message: 'Unexpected error while adding friend' });
  },

  async deleteFriend(req, res, next) {
    const user = await User.findOne({ _id: req.user.id });
    const otherUser = await User.findOne({ _id: req.params.id });

    if (!user || !otherUser) {
      return next();
    }

    const updatedUser = user.updateOne({
      $pull: { friends: req.params.id, friendsRequest: req.params.id },
    });
    const updatedOtherUser = otherUser.updateOne({
      $pull: { friends: req.user.id, friendsRequest: req.user.id },
    });

    const [savedUser, savedOtherUser] = await Promise.all([
      updatedUser,
      updatedOtherUser,
    ]).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while removing friend ', err });
    });

    return res.status(201).send({ data: { savedUser, savedOtherUser } });
  },
};
