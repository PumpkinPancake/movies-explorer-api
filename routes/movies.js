const moviesRouter = require("express").Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

const { createMovieValidator } = require("../middlewares/validation");

moviesRouter.get("/", getMovies);
moviesRouter.post("/", createMovieValidator, createMovie);
moviesRouter.delete("/:movieId", deleteMovie);

module.exports = moviesRouter;
