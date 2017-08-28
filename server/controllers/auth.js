'use strict';

const express = require('express');
const authService = require('../services/auth');

let router = express.Router();

router.post('/', authService.authentication);

module.exports = router;
