const { createQueue, enqueueRequest } = require('../services/queueService');

exports.enqueueRequest = async (req, res) => {
  const userId = req.user._id;
  const request = req.body;
  await createQueue(userId);
  await enqueueRequest(userId, request);
  res.send('Request enqueued');
};
