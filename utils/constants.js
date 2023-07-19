const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const SALT_ROUNDS = 10;

const userErrorMessage = {
  notFound: 'Пользователь не найден',
  wrongConflict: 'Пользователь с таким email адресом уже существует',
  badRequest: 'Неверные данные',
  Unauthorized: 'Неверные email или пароль.',
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

const authErrorMessage = {
  unauthorized: 'Invalid on expected token',
};

module.exports = {
  limiter,
  userErrorMessage,
  movieErrorMessage,
  routerErrorMessage,
  authErrorMessage,
  SALT_ROUNDS,
};
