'use strict'

const express = require('express')
const authService = require('../services/auth')
const conversationService = require('../services/conversation')

let router = express.Router()

// Authentification checking for all next routes
router.use(authService.checkToken)

router.post('/', conversationService.createConversation)
router.put('/:id', conversationService.addMembers)
router.get('/:id', conversationService.getConversation)
router.get('/:id/messages', conversationService.getMessages)

module.exports = router
