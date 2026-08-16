const { v4: uuidv4 } = require('uuid');

const generateRequestId = () => {
  const uuid = uuidv4();
  const shortId = uuid.split('-')[0].toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `Order-${shortId}-${timestamp}`;
};

module.exports = generateRequestId;