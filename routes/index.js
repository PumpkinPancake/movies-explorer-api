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

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('/*', (req, res, next) => {
  next(new NOT_FOUND_ERROR(routerErrorMessage.notFound));
});

module.exports = router;
