const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const { createUser, login } = require('./controllers/users');
const { signInValidation, signUpValidation } = require('./middlewares/requestsValidation');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(cors);

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => next(new NotFoundError('Некорректный адрес запроса')));

app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT);
