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
  },
  async getCommentsForPostId(postId, publicity) {
    const comments = await Comment.find({
      relatedPost: postId,
      publicity: publicity,
    })
      .populate('createdBy')
      .populate('replies');

    return comments;
  },
  async getRepliesForComment(relatedCommentId) {
    const comments = await Comment.find({
      relatedComment: relatedCommentId,
    })
      .populate('createdBy')
      .populate('replies');

    return comments;
  },
  async addReply(submittedReply) {
    const parentComment = await Comment.findOne({
      _id: submittedReply.relatedCommentId,
    });
    const user = await User.findOne({ _id: submittedReply.author });

    const reply = new Comment({
      content: submittedReply.content,
      createdBy: user,
      relatedComment: parentComment,
    });

    const updatedComment = parentComment.updateOne({
      $push: { replies: reply },
    });

    await Promise.all([updatedComment, reply.save()]).catch((err) => {
      return err;
    });
  },
};
