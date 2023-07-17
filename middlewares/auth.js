const { JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UNAUTHORIZED_ERROR('Invalid or expired token');
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UNAUTHORIZED_ERROR('Invalid token'));
    }
    next(err);
  }
  return next();
};

module.exports = auth;
