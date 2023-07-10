const NOT_FOUND_ERROR = require("../errors/notFoundError");
const ACCESS_DENIED_ERROR = require("../errors/accessDeniedError");

const Movies = require("../models/movie");

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
      if (err.name === "ValidationError") {
        return next(new NOT_FOUND_ERROR("Неверные данные."));
      }
      return next(err);
    });
}

function deleteMovie(req, res, next) {
  const { movieId } = req.params;

  Movies.findById(movieId)
    .orFail(new NOT_FOUND_ERROR("Фильм не найден."))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        return next(new ACCESS_DENIED_ERROR("Невозможно удалить фильм"));
      }
      return movie.deleteOne().then(() => {
        res.status(200).send({ message: "Фильм успешно удалён." });
      });
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
