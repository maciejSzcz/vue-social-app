import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
  {
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', PostSchema);
