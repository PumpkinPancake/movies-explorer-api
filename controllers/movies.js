const NOT_FOUND_ERROR = require('../errors/notFoundError');
const ACCESS_DENIED_ERROR = require('../errors/accessDeniedError');
const BAD_REQUEST_ERROR = require('../errors/badRequestError');

const { movieErrorMessage } = require('../utils/constants');

const Movies = require('../models/movie');

function getMovies(req, res, next) {
  const { _id } = req.user;

  Movies.find({ owner: _id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST_ERROR(movieErrorMessage.badRequest));
      }
      return next(err);
    });
}

function deleteMovie(req, res, next) {
  const { _id } = req.params;

  Movies.findById(_id)
    .orFail(new NOT_FOUND_ERROR(movieErrorMessage.notFound))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ACCESS_DENIED_ERROR(movieErrorMessage.accessDenied));
      }
      return movie.deleteOne().then(() => {
        res.status(200).send({ message: movieErrorMessage.send });
      });
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
