'use strict'

const express = require('express')
const authService = require('../services/auth')

let router = express.Router()

router.post('/', authService.authentication)
router.post('/reset_password', authService.resetPassword)

module.exports = router
