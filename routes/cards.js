const router = require('express').Router();
const auth = require('../middlewares/auth');
const { cardValidation, cardIdValidation } = require('../middlewares/requestsValidation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);
router.post('/cards', cardValidation, auth, createCard);
router.delete('/cards/:cardId', cardIdValidation, auth, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, auth, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidation, auth, dislikeCard);

module.exports = router;
