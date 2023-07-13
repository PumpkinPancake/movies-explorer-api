const { JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const { authErrorMessage } = require('../utils/constants');

const isDev = process.env.NODE_ENV !== 'production';

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (isDev) {
    req.user = { devMode: true };
    return next();
  }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UNAUTHORIZED_ERROR(authErrorMessage.Unauthorized);
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UNAUTHORIZED_ERROR(authErrorMessage.Unauthorized));
    }
  }
  return next();
};

module.exports = auth;
