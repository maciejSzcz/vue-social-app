export default (publicity) => (req, res, next) => {
  res.locals.publicity = publicity;
  next();
};
