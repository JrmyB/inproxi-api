'use strict'

const
    express = require('express'),
    userService = require('../../../services/users')

let router = express.Router()

router.get('/', userService.getUsers)
router.get('/:id', userService.getUserWithId)

router.post('/', userService.createUser)

router.put('/:id', userService.updateUserWithId)

router.delete('/:id', userService.deleteUserWithId)

module.exports = router
