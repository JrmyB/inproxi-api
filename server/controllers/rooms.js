'use strict';

const express = require('express');
const roomService = require('../services/rooms');
const authService = require('../services/auth');

let router = express.Router();

// Authentification checking for all next routes
router.use(authService.checkToken);

router.post('/:id', roomService.createRoom);
router.get('/:id', roomService.getRoom);

module.exports = router;
