// wrap async controllers to avoid try/catch in every handler
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
