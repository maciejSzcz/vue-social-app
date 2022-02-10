import Message from '../models/Message.js';
import User from '../models/User.js';

export default {
  async getMessagesForUser(userId) {
    const messages = await User.findOne({ _id: userId })
      .populate('messages')
      .select('-_id')
      .select('messages');

    return messages;
  },
  async getMessagesBetweenUsers(user1, user2) {
    const messages = await Message.find({
      createdBy: { $in: [user1, user2] },
      recipient: { $in: [user1, user2] },
    })
      .populate('createdBy')
      .populate('recipient')
      .sort({ createdAt: -1 });

    return messages;
  },
  async addMessage({ content, recipientId }, currentUserId) {
    const recipient = await User.findOne({ _id: recipientId });
    const sender = await User.findOne({ _id: currentUserId });

    const createdMessage = new Message({
      content,
      recipient,
      createdBy: sender,
      viewed: false,
    });

    const updatedSender = sender.updateOne({
      $push: { messages: createdMessage },
    });

    const updatedRecipient = recipient.updateOne({
      $push: { messages: createdMessage },
    });

    const res = await Promise.all([
      updatedSender,
      updatedRecipient,
      createdMessage.save(),
    ]);

    return res[2];
  },
};
