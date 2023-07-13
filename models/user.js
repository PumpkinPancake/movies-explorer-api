const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const { userSchemaErrorMessage } = require('../utils/constants');

const userShema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверный email.',
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userShema.statics.findUserByCredentials = function searchUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UNAUTHORIZED_ERROR(userSchemaErrorMessage.Unauthorized),
        );
      }
      return bcryptjs.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UNAUTHORIZED_ERROR(userSchemaErrorMessage.Unauthorized),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userShema);
