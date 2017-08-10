'use strict'

const express = require('express');
const userService = require('../services/users');
const authService = require('../services/auth');

let router = express.Router();

// Create an user account
router.post('/', userService.createUser);

// AUTH CHECKING FOR ALL NEXT ROUTES
router.use(authService.checkToken);

// Retrieve all users
router.get('/', userService.getUsers);

// Retrieve a specific user by ID
router.get('/:id', userService.getUserWithId);

// Update a specific user by ID
router.put('/:id', userService.updateUserWithId);

// Delete an user account by ID
router.delete('/:id', userService.deleteUserWithId);

// Retrieve friend requests (incoming or outgoing)
// incoming: no params
// outgoing: params -> ?outgoing=1
router.get('/:id/friendrequests', userService.getFriendRequests);

module.exports = router;
