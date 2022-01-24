import User from '../models/User.js';
import Post from '../models/Post.js';

export default {
  async addPost(req, res) {
    const publicity = res.locals.publicity;
    const user = await User.findOne({ _id: req.params.id });

    const { content } = req.body;
    const post = new Post({ content, publicity, createdBy: user });

    const updatedUser = user.updateOne({
      $push: { posts: post },
    });

    const data = await Promise.all([updatedUser, post.save()]).catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error occurred while creating post ', err });
    });

    return res.status(201).send({ data: data[1] });
  },

  async findPostsForUser(req, res, next) {
    if (res.locals.isFriends || req.user.id === req.params.id) {
      /* const user = await User.findOne({ _id: req.params.id })
        .populate('posts')
        .select('posts')
        .populate('createdBy'); */

      const posts = await Post.find({ createdBy: req.params.id }).populate(
        'createdBy'
      );

      if (!posts) {
        return next();
      }
      return res.status(200).send({ data: posts });
    } else {
      /* const user = await User.findOne({ _id: req.params.id })
        .populate({
          path: 'posts',
          match: { publicity: 'publicPosts' },
        })
        .select('posts')
        .populate('createdBy'); */

      const posts = await Post.find({
        createdBy: req.params.id,
        publicity: 'publicPosts',
      }).populate('createdBy');

      if (!posts) {
        return next();
      }
      return res.status(200).send({ data: posts });
    }
  },

  async findAllPublicPosts(req, res, next) {
    const posts = await Post.find({ publicity: 'publicPosts' }).populate(
      'createdBy'
    );

    return res.status(200).send({ data: posts });
  },
};
