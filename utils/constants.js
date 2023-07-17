const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const userErrorMessage = {
  notFound: 'Пользователь не найден',
  wrongConflict: 'Пользователь с таким email адресом уже существует',
  badRequest: 'Неверные данные',
};

const movieErrorMessage = {
  badRequest: 'Неверные данные',
  notFound: 'Фильм не найден',
  accessDenied: 'Невозможно удалить фильм',
  send: 'Фильм успешно удалён',
};

const routerErrorMessage = {
  notFound: 'Такого адреса не существует.',
};

const userSchemaErrorMessage = {
  Unauthorized: 'Неверные email или пароль.',
};

module.exports = {
  limiter,
  userErrorMessage,
  movieErrorMessage,
  routerErrorMessage,
  userSchemaErrorMessage,
};
