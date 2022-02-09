import Message from '../models/Message.js';
import User from '../models/User.js';

export default {
  async getMessagesForUser(userId) {
    const comments = await User.findOne({ _id: userId })
      .populate('messages')
      .select('-_id')
      .select('messages');

    return comments;
  },
  async addMessage() {
    const recipient = await User.findOne({ _id: recipientId });
    /*     const sender = await User.findOne({ _id: createdBy });
     */
    const createdMessage = new Message({ content, createdBy });

    const updatedUser = recipient.updateOne({
      $push: { messages: createdMessage },
    });

    const [, savedComment] = await Promise.all([
      updatedUser,
      createdMessage.save(),
    ]);

    return savedComment;
  },
};
