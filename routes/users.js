const usersRouter = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');

const { updateUserValidator } = require('../middlewares/validation');

usersRouter.get('/me', getUser);
usersRouter.patch('/me', updateUserValidator, updateUser);

module.exports = usersRouter;
