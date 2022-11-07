require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { authValidation } = require('./middlewares/requestsValidation');

const centralErrorHandler = require('./middlewares/centralErrorHandler');

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

app.use(routesUsers);
app.use(routesCards);

app.post('/signup', authValidation, createUser);
app.post('/signin', authValidation, login);

app.use((req, res) => res.status(404).send({ message: 'Некорректный путь запроса' }));

app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT);
