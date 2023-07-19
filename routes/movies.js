const moviesRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', createMovieValidator, createMovie);
moviesRouter.delete('/:_id', deleteMovieValidator, deleteMovie);

module.exports = moviesRouter;
