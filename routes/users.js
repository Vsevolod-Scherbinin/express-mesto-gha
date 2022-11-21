const router = require('express').Router();
const {
  userIdValidation,
  userDataValidation,
  userAvatarValidation,
} = require('../middlewares/requestsValidation');

const {
  getUsers,
  getUserById,
  editUser,
  editAvatar,
  clearCookie,
} = require('../controllers/users');

// eslint-disable-next-line max-len
// Важна последовательность. :userId должен быть после get-запроса по users/me. Альтернатива - отдельный контроллер на users/me

router.get('/', getUsers);
router.get('/me', getUserById);
router.delete('/signout', clearCookie);
router.patch('/me', userDataValidation, editUser);
router.patch('/me/avatar', userAvatarValidation, editAvatar);
router.get('/:userId', userIdValidation, getUserById);

module.exports = router;
