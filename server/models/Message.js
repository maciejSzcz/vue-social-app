import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
  {
    content: String,
    viewed: Boolean,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', MessageSchema);
