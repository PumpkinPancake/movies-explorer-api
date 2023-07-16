const mongoose = require('mongoose');

const cors = require('cors');

const express = require('express');

const helmet = require('helmet');

const { errors } = require('celebrate');

const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { errorHandler } = require('./middlewares/errorHandler');

const { limiter } = require('./utils/constants');

const { MONGO_URL, PORT } = require('./config');

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
