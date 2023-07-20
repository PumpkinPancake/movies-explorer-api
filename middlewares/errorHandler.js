const { errorHandlerMessage } = require('../utils/constants');

const errorHandler = (error, req, res, next) => {
  const { status = 500, message } = error;

  res.status(status).send({
    message: status === 500 ? errorHandlerMessage.erServer : message,
  });

  next(error);
};

module.exports = errorHandler;
