const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authController = require('./controllers/authController');
const requestController = require('./controllers/requestController');
const authenticateJWT = require('./middleware/authMiddleware');
const { connectRabbitMQ } = require('./services/queueService'); // Update import
const logger = require('./logger'); // Update the logger import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ().then(() => {
  // API routes
  app.post('/register', authController.register);
  app.post('/login', authController.login);
  app.post('/enqueue', authenticateJWT, requestController.enqueueRequest);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logger.info('Server started'); // Use the logger to log server startup
  });

  // Process RabbitMQ requests
  // Ensure this is called after RabbitMQ connection is established
  // processRequests(); // You may call this if you want to start processing requests immediately
}).catch(err => {
  console.error('Error connecting to RabbitMQ:', err);
  process.exit(1);
});
