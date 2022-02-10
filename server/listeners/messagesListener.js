import messagesController from '../controllers/messagesController.js';

export default (io) => {
  io.on('connection', (socket) => {
    socket.on('joinChat', async ({ currentUserId, recipientId }) => {
      socket.join(`chat:${currentUserId}`);

      const messagesBetweenUsers =
        await messagesController.getMessagesBetweenUsers(
          currentUserId,
          recipientId
        );

      io.in(`chat:${currentUserId}`).emit(
        `initialMessages:${currentUserId}`,
        messagesBetweenUsers
      );
    });

    socket.on('messages:get', async (currentUserId) => {
      const messagesForUser = await messagesController.getMessagesForUser(
        currentUserId
      );

      socket.emit(`messages:${currentUserId}`, messagesForUser);
    });

    socket.on('messages:send', async (message) => {
      const { recipientId, currentUserId } = message;

      await messagesController.addMessage(message, currentUserId);

      const messagesBetweenUsers =
        await messagesController.getMessagesBetweenUsers(
          currentUserId,
          recipientId
        );

      io.in(`chat:${recipientId}`).emit(
        `messageFrom:${currentUserId}`,
        messagesBetweenUsers
      );
      io.in(`chat:${currentUserId}`).emit(
        `messageFrom:${recipientId}`,
        messagesBetweenUsers
      );
    });
  });
};
