import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
  {
    content: String,
    publicity: {
      type: String,
      enum: ['privatePosts', 'publicPosts', 'general'],
      default: 'general',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
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

export default mongoose.model('Post', PostSchema);
