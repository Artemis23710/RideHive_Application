require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Basic security
app.use(helmet());

// CORS - allow only origins you trust in production
app.use(cors());

// Body parsers - INCREASE LIMIT FOR FORM DATA
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse form submissions

// HTTP request logging (dev-friendly)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api', require('./routes'));

// 404 handler
app.use(notFound);

// Error handler (must come last)
app.use(errorHandler);

module.exports = app;
