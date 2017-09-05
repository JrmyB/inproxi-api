'use strict';

const roomMethods = require('../models/room/methods');
const userMethods = require('../models/user/methods');

const createRoom = (req, res) => {
    if (!req.body.name || !req.body.owner)
	return res.status(422).json({ message: 'Required field(s) missing.'})

    roomMethods.createRoom(req.body, (err, room) => {
	if (err) return res.status(500).send({ message: 'Internal server error.' });

	res.status(200).send({
	    _id: room._id,
	    name: room.name,
	    members: room.members
	});
    });
};

const getRoom = (req, res) => {
  roomMethods.getRoomById(req.params.id, (err, room) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (room === null) return res.status(404).send({ message: 'Room not found.' });
    
    res.status(200).json(room);
  });
};

module.exports = {
    createRoom: createRoom,
    getRoom: getRoom
};