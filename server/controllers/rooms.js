'use strict'

const express = require('express')
const roomService = require('../services/rooms')
const authService = require('../services/auth')

let router = express.Router()

// Authentification checking for all next routes
router.use(authService.checkToken)

router.post('/', roomService.createRoom)
router.put('/:id', roomService.updateRoom)
router.get('/:id', roomService.getRoom)
router.get('/', roomService.getRooms)

module.exports = router
