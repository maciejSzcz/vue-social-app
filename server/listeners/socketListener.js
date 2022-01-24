export default (io) => {
  io.on('connection', () => {
    console.log('hello there');
  });
};
