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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Comment', CommentSchema);
