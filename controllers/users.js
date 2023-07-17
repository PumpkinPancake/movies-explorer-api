const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const WRONG_CONFLICT_ENTITY = require('../errors/wrongConflictEntity');
const NOT_FOUND_ERROR = require('../errors/notFoundError');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const { userErrorMessage } = require('../utils/constants');

const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = require('../config');
const { match } = require('assert');

const SALT_ROUNDS = 10;

const getUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NOT_FOUND_ERROR(userErrorMessage.notFound));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new BAD_REQUEST_ERROR(userErrorMessage.badRequest));
      }

      return next(res);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findUserByCredentials(email, password)

    .then(({ _id }) => {
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => {
      User
        .create({ email, password: hash, name })
        .then(() => {
          res.status(201).json({ name, email });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new WRONG_CONFLICT_ENTITY(userErrorMessage.wrongConflict));
          }
          if (err.name === 'ValidationError') {
            return next(new BAD_REQUEST_ERROR(userErrorMessage.badRequest));
          }
          return next(err);
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(new NOT_FOUND_ERROR(userErrorMessage.notFound))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST_ERROR(userErrorMessage.badRequest));
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  login,
  createUser,
  updateUser,
};
