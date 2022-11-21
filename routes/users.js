const router = require('express').Router();
const auth = require('../middlewares/auth');
const { userIdValidation, userDataValidation, userAvatarValidation } = require('../middlewares/requestsValidation');
const cors = require('../middlewares/cors');

router.use(cors);

const {
  getUsers, getUserById, editUser, editAvatar,
} = require('../controllers/users');

// eslint-disable-next-line max-len
// Важна последовательность. :userId должен быть после get-запроса по users/me. Альтернатива - отдельный контроллер на users/me
router.use(auth);
router.get('/users', getUsers);
router.get('/users/me', getUserById);
router.patch('/users/me', userDataValidation, editUser);
router.patch('/users/me/avatar', userAvatarValidation, editAvatar);
router.get('/users/:userId', userIdValidation, getUserById);

module.exports = router;
