'use strict'

const
    express = require('express'),
    authController = require('../../../controllers/apis/auth'),
    usersController = require('../../../controllers/apis/users'),
    authService = require('../../../services/auth')

let router = express.Router()

router.use('/auth', authController)

router.use(authService.checkToken)
router.use('/users', usersController)

module.exports = router
