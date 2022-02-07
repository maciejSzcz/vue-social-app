import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema(
  {
    content: String,
    publicity: {
      type: String,
      enum: ['privatePosts', 'publicPosts'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    relatedComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Comment', CommentSchema);
