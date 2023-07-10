const validator = require("validator");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const movieShema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: "Неверный URL-адрес.",
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: "Неверный URL-адрес.",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: "Неверный URL-адрес.",
    },
  },
  owner: {
    required: true,
    type: ObjectId,
    ref: "user",
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("movie", movieShema);
