const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BAD_REQUEST_ERROR = require("../errors/badRequestError");
const WRONG_CONFLICT_ENTITY = require("../errors/wrongConflictEntity");
const NOT_FOUND_ERROR = require("../errors/notFoundError");

const user = require("../models/user");

const { JWT_SECRET, NODE_ENV } = require("../config");

const SALT_ROUNDS = 10;

const getUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR("Пользователь не существует.");
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
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.send({ token, message: "Авторизация прошла успешно!" });
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
        .then(() => res.status(201).send({ data: { email, name } }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new WRONG_CONFLICT_ENTITY(
                `Пользователь с адресом ${email} уже существует.`
              )
            );
          }
          if (err.name === "ValidationError") {
            return next(new BAD_REQUEST_ERROR("Неверные данные."));
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
    .orFail(new NOT_FOUND_ERROR("Пользователь не найден."))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST_ERROR("Неверные данные."));
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
