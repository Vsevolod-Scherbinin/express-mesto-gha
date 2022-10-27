const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mestodb');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '635a4875a6daa9e935047bca'
  };

  next();
});

app.use(express.json());
app.use(routesUsers);
app.use(routesCards);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
