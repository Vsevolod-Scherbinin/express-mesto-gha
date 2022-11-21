const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { signInValidation, signUpValidation } = require('./middlewares/requestsValidation');
const { clearCookie } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const cors = require('./middlewares/cors');

mongoose.connect('mongodb://localhost:27017/mestodb');

const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(cors);

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

const allowedCors = [
  'https://scherbinin.mesto.nomoredomains.club',
  'http://scherbinin.mesto.nomoredomains.club',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);
app.get('/signout', clearCookie);

app.use(routesUsers);
app.use(routesCards);

app.use((req, res, next) => next(new NotFoundError('Некорректный адрес запроса')));

app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT);
