
const
    express = require('express'),
    authService = require('../../../services/auth')

let router = express.Router()

router.post('/', authService.authentication)

module.exports = router
