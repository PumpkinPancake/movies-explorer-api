const { JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  let payload;
  if (!authorization || !authorization.startsWith('Bearer ')) return next(new UNAUTHORIZED_ERROR('Invalid token'));
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UNAUTHORIZED_ERROR('Invalid token'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
