'use strict';

const express = require('express');
const friendRequestService = require('../services/friendRequest')
const authService = require('../services/auth');

let router = express.Router();

// AUTH CHECKING FOR ALL NEXT ROUTES
router.use(authService.checkToken);

// Add a friend request
router.post('/', friendRequestService.add);

// Update a friend request (status: accept | remove (cancel or decline))
router.put('/:id', friendRequestService.update)

module.exports = router;
