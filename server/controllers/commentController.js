import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

export default {
  async addComment(submittedComment) {
    const publicity = submittedComment.publicity;
    const post = await Post.findOne({ _id: submittedComment.relatedPostId });
    const user = await User.findOne({ _id: submittedComment.author });

    if (post.publicity != publicity && post.publicity != 'general') {
      return 'error';
    }

    const comment = new Comment({
      content: submittedComment.content,
      relatedPost: post,
      createdBy: user,
      publicity: publicity,
    });

    const updatedPost = post.updateOne({
      $push: { comments: comment },
    });

    await Promise.all([updatedPost, comment.save()]).catch((err) => {
      return err;
    });

    return true;
  },
  async getCommentsForPostId(postId) {
    const comments = await Comment.find({ relatedPost: postId }).populate(
      'createdBy'
    );

    return comments;
  },
};
