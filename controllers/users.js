const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const WRONG_CONFLICT_ENTITY = require('../errors/wrongConflictEntity');
const NOT_FOUND_ERROR = require('../errors/notFoundError');

const { userErrorMessage } = require('../utils/constants');

const user = require('../models/user');

const { JWT_SECRET, NODE_ENV } = require('../config');

const SALT_ROUNDS = 10;

const getUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR(userErrorMessage.notFound);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

function login(req, res, next) {
  const { email, password } = req.body;

  user
    .findUserByCredentials(email, password)

    .then(({ _id }) => {
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      return res.send({ token });
    })
    .catch(next);
}

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => {
      user
        .create({ email, password: hash, name })
        .then((createdUser) => {
          const { name, email } = createdUser;
          res.status(201).json({ name, email });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new WRONG_CONFLICT_ENTITY(userErrorMessage.wrongConflict)
            );
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

  user
    .findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      }
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
