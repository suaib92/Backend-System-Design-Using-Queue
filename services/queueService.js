const amqp = require('amqplib');

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1);
  }
}

async function createQueue(userId) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  await channel.assertQueue(userId, { durable: true });
}

async function enqueueRequest(userId, request) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  await channel.sendToQueue(userId, Buffer.from(JSON.stringify(request)), { persistent: true });
}

async function processRequests(userId) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  await channel.consume(userId, async (msg) => {
    if (msg !== null) {
      const request = JSON.parse(msg.content.toString());
      console.log(`Processing request for user ${userId}:`, request);

      // Simulate request processing
      await handleRequest(request);

      channel.ack(msg);
    }
  });
}

module.exports = {
  connectRabbitMQ,
  createQueue,
  enqueueRequest,
  processRequests,
};
