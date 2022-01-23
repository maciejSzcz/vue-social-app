import User from '../models/User.js';
import Post from '../models/Post.js';

export default {
  async addPost(req, res) {
    const publicity = res.locals.publicity;
    const user = await User.findOne({ _id: req.params.id });

    const { content } = req.body;
    const post = new Post({ content, createdBy: user });

    const updatedUserFields =
      publicity !== 'general'
        ? { [res.locals.publicity]: post }
        : { publicPosts: post, privatePosts: post };

    const updatedUser = user.updateOne({
      $push: updatedUserFields,
    });

    const data = await Promise.all([updatedUser, post.save()]).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while creating post ', err });
    });

    return res.status(201).send({ data: data[1] });
  },

  async findPostsForUser(req, res, next) {
    console.log('is friends - ', res.locals.isFriends);
    if (res.locals.isFriends || req.user.id === req.params.id) {
      const user = await User.findOne({ _id: req.params.id })
        .populate('publicPosts')
        .populate('privatePosts');

      if (!user) {
        return next();
      }
      return res.status(200).send({ data: user });
    } else {
      const user = await User.findOne({ _id: req.params.id })
        .select('-privatePosts')
        .populate('publicPosts');

      if (!user) {
        return next();
      }
      return res.status(200).send({ data: user });
    }
  },
};
