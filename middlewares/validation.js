const { Joi, celebrate } = require("celebrate");

const { URL_REGEX, PASSWORD_REGEX, EMAIL_REGEX } = require("../regex");

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
  }),
});

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(EMAIL_REGEX),
  }),
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
    name: Joi.string().required().min(2).max(30),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    thumbnail: Joi.string().required().pattern(URL_REGEX),
    trailer: Joi.string().required().pattern(URL_REGEX),
    image: Joi.string().required().pattern(URL_REGEX),
    description: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    year: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  loginValidator,
  updateUserValidator,
  createUserValidator,
  createMovieValidator,
  deleteMovieValidator,
};
