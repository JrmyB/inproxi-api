'use strict';

const express = require('express');
const roomService = require('../services/rooms');
const authService = require('../services/auth');

let router = express.Router();

// Authentification checking for all next routes
router.use(authService.checkToken);

router.post('/:id', roomService.createRoom);
router.get('/:id', roomService.getRoom);
router.get('/:id/members', roomService.getMembers);

// TODO: A DEPLACER DANS USERS CONTROLLER
// router.post('/:id/join', roomService.joinRoom);
// router.post('/:id/leave', roomService.leaveRoom);

module.exports = router;
