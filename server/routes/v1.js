'use strict'

const express = require('express')
const authController = require('../controllers/auth')
const usersController = require('../controllers/users')
const friendRequestController = require('../controllers/friendRequest')
const roomsController = require('../controllers/rooms')
const searchUserController = require('../controllers/searchUser')
const conversationController = require('../controllers/conversation')

let router = express.Router()

router.use('/auth', authController)
router.use('/users', usersController)
router.use('/friendrequest', friendRequestController)
router.use('/room', roomsController)
router.use('/search_user', searchUserController)
router.use('/conversation', conversationController)

module.exports = router
