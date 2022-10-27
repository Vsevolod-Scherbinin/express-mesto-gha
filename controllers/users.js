const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error ('NorFound'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err instanceof mongoose.Error.CastError) {
        res.status(400).send({message: "Некорректные данные"});
        return;
      }

      if(err.message === 'NotFound') {
        res.status(404).send({message: "Запрашиваемый пользователь не найден"});
        return;
      }

      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({message: "Некорректные данные"});
        return;
      }

      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name: name, about: about }, {
    new: true,
    runValidators: true,
    upsert: true
  }).orFail(new Error ('NorFound'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({message: "Некорректные данные"});
        return;
      }

      if(err.message === 'NotFound') {
        res.status(404).send({message: "Запрашиваемый пользователь не найден"});
        return;
      }

      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, {
    new: true,
    runValidators: true,
    upsert: true
  }).orFail(new Error ('NorFound'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({message: "Некорректные данные"});
        return;
      }

      if(err.message === 'NotFound') {
        res.status(404).send({message: "Запрашиваемый пользователь не найден"});
        return;
      }

      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}
