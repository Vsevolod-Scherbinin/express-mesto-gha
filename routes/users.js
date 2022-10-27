const router = require('express').Router();
const User = require('../models/user');

const {getUsers, getUserById, createUser, editUser, editAvatar} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', editUser);

router.patch('/users/me/avatar', editAvatar);

module.exports = router;
