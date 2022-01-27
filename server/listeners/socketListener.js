import commentController from '../controllers/commentController.js';

export default (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('comment', async (comment) => {
      await commentController.addComment(comment);

      const commentsForPost = await commentController.getCommentsForPostId(
        comment.relatedPostId,
        comment.publicity
      );

      io.in(`${comment.relatedPostId}/${comment.publicity}`).emit(
        `${comment.relatedPostId}/${comment.publicity}`,
        commentsForPost
      );
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
