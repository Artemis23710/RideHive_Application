const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

async function start() {
  try {
    await connectDB(MONGO_URI);

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Closing server...`);
      server.close(err => {
        if (err) {
          logger.error('Error closing server', err);
          process.exit(1);
        }
        // close DB connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // handle unhandled rejections/exceptions
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', reason);
      // optionally shut down gracefully
    });
  } catch (err) {
    logger.error('Failed to start app', err);
    process.exit(1);
  }
}

start();
