const router = require('express').Router();

const { login, createUser } = require('../controllers/users');

const moviesRouter = require('./movies');
const usersRouter = require('./users');

const { routerErrorMessage } = require('../utils/constants');

const {
  loginValidator,
  createUserValidator,
} = require('../middlewares/validation');

const NOT_FOUND_ERROR = require('../errors/badRequestError');
const auth = require('../middlewares/auth');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use('/*', auth, (req, res, next) => {
  next(new NOT_FOUND_ERROR(routerErrorMessage.notFound));
});

module.exports = router;
