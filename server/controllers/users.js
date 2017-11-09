'use strict'

const express = require('express')
const userService = require('../services/users')
const authService = require('../services/auth')

let router = express.Router()

router.post('/', userService.createUser)

// Authentification checking for all next routes
router.use(authService.checkToken)

router.get('/:id', userService.getUser)
router.put('/:id', userService.updateUser)
router.delete('/:id', userService.deleteUser)
router.get('/:id/friends', userService.getFriends)
router.get('/:id/conversations', userService.getConversations)

// Retrieve friend requests (incoming or outgoing)
// incoming: no params
// outgoing: params -> ?outgoing=1
router.get('/:id/friendrequests', userService.getFriendRequests)

module.exports = router;
