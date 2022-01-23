import User from '../models/User.js';

export default async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    friends: { $in: req.user.id },
  });
  res.locals.isFriends = user !== null;
  next();
};
