import Message from '../models/Message.js';
import User from '../models/User.js';

export default {
  async getUnreadMessagesForUser(userId) {
    const unreadMessages = await Message.find({
      recipient: userId,
      viewed: false,
    });

    return unreadMessages;
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
  async markAllMessagesFromUserAsRead(user1, user2) {
    const messages = await Message.updateMany(
      {
        createdBy: user2,
        recipient: user1,
      },
      {
        $set: { viewed: true },
      }
    );

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
