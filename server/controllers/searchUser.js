'use strict'

const express = require('express')
const authService = require('../services/auth')
const searchUserService = require('../services/searchUser')

let router = express.Router();

// Authentification checking for all next routes
router.use(authService.checkToken)

router.get('/', searchUserService)

module.exports = router
