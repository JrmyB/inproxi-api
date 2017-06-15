'use strict'

const
    express = require('express'),
    userService = require('../services/users'),
    authService = require('../services/auth')

let router = express.Router()

router.post('/', userService.createUser)

router.use(authService.checkToken) // token required for next routes

router.get('/', userService.getUsers)
router.get('/:id', userService.getUserWithId)
router.put('/:id', userService.updateUserWithId)
router.delete('/:id', userService.deleteUserWithId)

module.exports = router
