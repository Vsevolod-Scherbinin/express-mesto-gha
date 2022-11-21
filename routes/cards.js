const router = require('express').Router();
const auth = require('../middlewares/auth');
const { cardValidation, cardIdValidation } = require('../middlewares/requestsValidation');
// const cors = require('../middlewares/cors');

// router.use(cors);

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.use(auth);
router.get('/cards', getCards);
router.post('/cards', cardValidation, createCard);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
