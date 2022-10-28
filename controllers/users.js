const mongoose = require('mongoose');
const User = require('../models/user');
const {
  NotFound, CastError, Error400, Error404, Error500,
} = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(Error500).send({ message: 'Произошла неизвестная ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error(NotFound))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === CastError) {
        res.status(Error400).send({ message: 'Некорректные данные' });
        return;
      }

      if (err.message === NotFound) {
        res.status(Error404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(Error500).send({ message: 'Произошла неизвестная ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Error400).send({ message: 'Некорректные данные' });
        return;
      }

      res.status(Error500).send({ message: 'Произошла неизвестная ошибка' });
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail(new Error(NotFound))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Error400).send({ message: 'Некорректные данные' });
        return;
      }

      if (err.message === NotFound) {
        res.status(Error404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(Error500).send({ message: 'Произошла неизвестная ошибка' });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(new Error(NotFound))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(Error400).send({ message: 'Некорректные данные' });
        return;
      }

      if (err.message === NotFound) {
        res.status(Error404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(Error500).send({ message: 'Произошла неизвестная ошибка' });
    });
};
