const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { signInValidation, signUpValidation } = require('./middlewares/requestsValidation');
const { clearCookie } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const cors = require('./middlewares/cors');

mongoose.connect('mongodb://localhost:27017/mestodb');

const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);
app.get('/signout', clearCookie);

app.use(routesUsers);
app.use(routesCards);

app.use((req, res, next) => next(new NotFoundError('Некорректный адрес запроса')));

app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT);
