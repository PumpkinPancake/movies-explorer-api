const errorHandler = (error, req, res, next) => {
  const { status = 500, message } = error;

  res.status(status).send({
    message: status === 500 ? 'Error on the server' : message,
  });

  return next();
};

module.exports = { errorHandler };
