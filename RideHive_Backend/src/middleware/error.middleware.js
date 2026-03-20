const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message || 'Server error', { stack: err.stack });

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      // in production, avoid exposing stack traces
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;
