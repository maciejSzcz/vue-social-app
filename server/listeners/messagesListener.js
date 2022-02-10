import messagesController from '../controllers/messagesController.js';

export default (io) => {
  io.on('connection', (socket) => {
    socket.on('joinChat', async ({ recipientId }) => {
      const currentUserId = socket.request.user.id;

      socket.join(`chat:${currentUserId}:${recipientId}`);
      const messagesBetweenUsers =
        await messagesController.getMessagesBetweenUsers(
          currentUserId,
          recipientId
        );

      io.in(`chat:${currentUserId}:${recipientId}`).emit(
        `initialMessages:${currentUserId}`,
        messagesBetweenUsers
      );
    });

    socket.on('messages:get', async () => {
      const currentUserId = socket.request.user.id;

      const messagesForUser = await messagesController.getUnreadMessagesForUser(
        currentUserId
      );

      socket.emit(`messages:${currentUserId}`, messagesForUser);
    });

    socket.on('messages:read', async ({ recipientId }) => {
      const currentUserId = socket.request.user.id;
      await messagesController.markAllMessagesFromUserAsRead(
        currentUserId,
        recipientId
      );
      const messagesForCurrentUser =
        await messagesController.getUnreadMessagesForUser(currentUserId);

      io.emit(`messages:${currentUserId}`, messagesForCurrentUser);
    });

    socket.on('messages:send', async (message) => {
      const currentUserId = socket.request.user.id;
      const { recipientId } = message;

      await messagesController.addMessage(message, currentUserId);

      const messagesBetweenUsers =
        await messagesController.getMessagesBetweenUsers(
          currentUserId,
          recipientId
        );

      io.in(`chat:${recipientId}:${currentUserId}`).emit(
        `messageFrom:${currentUserId}`,
        messagesBetweenUsers
      );
      socket.emit(`messageFrom:${currentUserId}`, messagesBetweenUsers);

      const messagesForRecipient =
        await messagesController.getUnreadMessagesForUser(recipientId);

      io.emit(`messages:${recipientId}`, messagesForRecipient);
    });
  });
};
