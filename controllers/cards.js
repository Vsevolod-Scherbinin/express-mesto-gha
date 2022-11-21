/* eslint-disable no-console */
const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  NotFound, CastError,
} = require('../constants/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    // .then((cards) => res.send({ data: cards })) fixed
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    // .then((card) => res.send({ data: card })) fixed
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(() => new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        // return next(new ForbiddenError('Функция недоступна'));
        throw new ForbiddenError('Функция недоступна');
        // res.send({ message: 'Функция недоступна' });
      }
      return Card.findByIdAndRemove(req.params.cardId).orFail(new Error(NotFound))
        // eslint-disable-next-line no-shadow
        .then((card) => {
          res.send({ data: card });
          // res.send(card); fixed
        });
    })
    .catch((err) => {
      if (err.name === CastError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error(NotFound))
    // .then((card) => res.send({ data: card }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === CastError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      if (err.message === NotFound) {
        return next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }

      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error(NotFound))
    // .then((card) => res.send({ data: card }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === CastError) {
        return next(new BadRequestError('Некорректные данные'));
      }

      if (err.message === NotFound) {
        return next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }

      return next(err);
    });
};
