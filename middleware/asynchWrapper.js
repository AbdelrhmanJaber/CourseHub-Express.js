module.exports = (asynchFn) => {
  return (req, res, next) => {
    asynchFn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
