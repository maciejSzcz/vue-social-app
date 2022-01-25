/* import commentController from '../controllers/commentController.js';
 */
export default (io) => {
  io.on('connection', (socket) => {
    console.log('hello there');

    socket.on('comment', async (comment) => {
      console.log(comment);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
