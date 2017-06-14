
const
    express = require('express'),
    authService = require('../../../services/auth')

let router = express.Router()

router.post('/', authService.getToken)

module.exports = router
