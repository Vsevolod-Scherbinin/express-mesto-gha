const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwtoken = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const {
  JWT_SECRET, NotFound, CastError,
} = require('../constants/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    // eslint-disable-next-line no-undef, arrow-parens
    .catch(err => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId || req.user._id).orFail(new Error(NotFound))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === CastError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      if (err.message === NotFound) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такими данными уже существует'));
      }

      return next(err);
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail(new Error(NotFound))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      if (err.message === NotFound) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      return next(err);
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(new Error(NotFound))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      if (err.message === NotFound) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .status(200).send({ message: 'Авторзация прошла успешно' });
    })
    // eslint-disable-next-line arrow-body-style, no-unused-vars
    .catch((err) => {
      return next(new UnauthorizedError('Ошибка авторизации'));
    });
};
