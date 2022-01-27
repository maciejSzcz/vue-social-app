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
      const posts = await Post.find({ createdBy: req.params.id }).populate(
        'createdBy'
      );

      if (!posts) {
        return next();
      }
      return res.status(200).send({ data: posts });
    } else {
      const posts = await Post.find({
        createdBy: req.params.id,
        $or: [{ publicity: 'publicPosts' }, { publicity: 'general' }],
      })
        .populate('createdBy')
        .sort({ createdAt: -1 });

      if (!posts) {
        return next();
      }
      return res.status(200).send({ data: posts });
    }
  },

  async findPostsForUserWithPublicity(req, res, next) {
    const publicity = res.locals.publicity;
    const isSelf = req.user && req.user.id === req.params.id;

    if (!res.locals.isFriends && !isSelf && publicity === 'privatePosts') {
      return next();
    }

    const posts = await Post.find({
      createdBy: req.params.id,
      $or: [{ publicity: publicity }, { publicity: 'general' }],
    })
      .populate('createdBy')
      .sort({ createdAt: -1 });

    if (!posts) {
      return next();
    }

    return res.status(200).send({ data: posts });
  },

  async findAllPublicPosts(req, res, next) {
    const posts = await Post.find({
      publicity: { $in: ['publicPosts', 'general'] },
    })
      .populate('createdBy')
      .sort({ createdAt: -1 });

    return res.status(200).send({ data: posts });
  },

  async findAllPrivatePosts(req, res, next) {
    const posts = await Post.aggregate([
      {
        $match: {
          publicity: { $in: ['privatePosts', 'general'] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: 'friends',
          as: 'creator_friends',
        },
      },
      {
        $unwind: '$creator_friends',
      },
      {
        $project: {
          _id: 1,
          publicity: 1,
          content: 1,
          comments: 1,
          createdBy: 1,
          createdAt: 1,
          creator_friend_id: '$creator_friends._id',
        },
      },
      {
        $match: {
          $or: [
            { createdBy: req.user._id },
            { creator_friend_id: req.user._id },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          creator_friend_id: 0,
        },
      },
    ]);

    const populatedPosts = await Post.populate(posts, {
      path: 'createdBy',
    });

    return res.status(200).send({ data: populatedPosts });
  },

  async getPostById(req, res, next) {
    const post = await Post.findOne({ _id: req.params.id })
      .populate('createdBy')
      .populate({
        path: 'comments',
        populate: { path: 'createdBy', model: 'User' },
      });

    return res.status(200).send({ data: post });
  },

  async getPostByIdWithPublicity(req, res, next) {
    const publicity = res.locals.publicity;
    const post = await Post.findOne({ _id: req.params.id })
      .populate('createdBy')
      .populate({
        path: 'comments',
        match: { publicity: publicity },
        populate: { path: 'createdBy', model: 'User' },
      });

    return res.status(200).send({ data: post });
  },
};
