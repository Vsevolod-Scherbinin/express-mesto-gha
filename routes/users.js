const router = require('express').Router();
const auth = require('../middlewares/auth');
const { userIdValidation, userDataValidation, userAvatarValidation } = require('../middlewares/requestsValidation');

const {
  getUsers, getUserById, editUser, editAvatar,
} = require('../controllers/users');

// eslint-disable-next-line max-len
// Важна последовательность. :userId должен быть после get-запроса по users/me. Альтернатива - отдельный контроллер на users/me
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserById);
router.patch('/users/me', userDataValidation, auth, editUser);
router.patch('/users/me/avatar', userAvatarValidation, auth, editAvatar);
router.get('/users/:userId', userIdValidation, auth, getUserById);

module.exports = router;
