'use strict';

const express = require('express');
const authController = require('../controllers/auth');
const usersController = require('../controllers/users');
const friendRequestController = require('../controllers/friendRequest');

let router = express.Router();

router.use('/auth', authController);
router.use('/users', usersController);
router.use('/friendrequest', friendRequestController);

module.exports = router
