import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export default {
  async addComment(req, res) {
    const publicity = res.locals.publicity;
    const post = await Post.findOne({ _id: req.params.id });
    const user = await User.findOne({ _id: req.user.id });

    if (post.publicity != publicity || post.publicity != 'general') {
      return res
        .status(400)
        .send({ message: 'Cannot add a comment to this post now ', err });
    }
    const { content } = req.body;
    const comment = new Comment({
      content,
      relatedPost: post,
      createdBy: user,
    });

    const updatedPost = post.updateOne({
      $push: { comments: comment },
    });

    const data = await Promise.all([updatedPost, comment.save()]).catch(
      (err) => {
        return res
          .status(500)
          .send({ message: 'Error occurred while adding comment ', err });
      }
    );

    return res.status(201).send({ data: data[1] });
  },
};
