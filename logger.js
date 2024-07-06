const winston = require('winston');
require('winston-console-formatter'); // Optional for colored console logs

const logger = winston.createLogger({
  level: 'info', // Set the minimum logging level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    // Add more transports as needed (file, database, etc.)
  ],
});

module.exports = logger;
