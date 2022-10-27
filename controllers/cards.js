const Card = require('../models/card');
const mongoose = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({message: "Некорректные данные"});
        return;
      }

      res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
      return;
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error ('NotFound'))
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if(err.name === 'CastError') {
      res.status(400).send({message: "Некорректные данные"});
      return;
    }

    if(err.message === 'NotFound') {
      res.status(404).send({message: "Запрашиваемая карточка не найдена"});
      return;
    }

    res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
    return;
  });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error ('NotFound'))
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if(err.name === 'CastError') {
      res.status(400).send({message: "Некорректные данные"});
      return;
    }

    if(err.message === 'NotFound') {
      res.status(404).send({message: "Запрашиваемая карточка не найдена"});
      return;
    }

    res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
    return;
  });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error ('NotFound'))
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if(err.name === 'CastError') {
      res.status(400).send({message: "Некорректные данные"});
      return;
    }

    if(err.message === 'NotFound') {
      res.status(404).send({message: "Запрашиваемая карточка не найдена"});
      return;
    }

    res.status(500).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`})
    return;
  });
}