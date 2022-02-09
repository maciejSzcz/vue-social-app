import messagesController from '../controllers/messagesController.js';

export default (io) => {
  io.on('connection', (socket) => {
    socket.on('joinChat', (userId) => {
      socket.join(userId);
    });

    socket.on('messages:get', async () => {
      const currentUserId = socket.request.user._id;

      const messagesForUser = await messagesController.getMessagesForUser(
        currentUserId
      );

      socket.emit(`messages:${currentUserId}`, messagesForUser);
    });

    socket.on('messages:send', async (message) => {
      const { recipientId } = message;
      const currentUserId = socket.request.user._id;

      await messagesController.addMessage(message, currentUserId);

      const messagesForRecipient = await messagesController.getMessagesForUser(
        recipientId
      );

      socket.emit(`messages:${recipientId}`, messagesForRecipient);
    });
  });
};
