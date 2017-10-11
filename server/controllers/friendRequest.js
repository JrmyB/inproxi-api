'use strict'

const express = require('express')
const friendRequestService = require('../services/friendRequest')
const authService = require('../services/auth')

let router = express.Router()

// AUTH CHECKING FOR ALL NEXT ROUTES
router.use(authService.checkToken)

router.post('/', friendRequestService.add)
router.put('/:id', friendRequestService.update) // Status: accept | remove (cancel or decline)

module.exports = router
