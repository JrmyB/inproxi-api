'use strict'

const roomMethods = require('../models/room/methods')
const userMethods = require('../models/user/methods')
const debug = require('debug')('http')

const createRoom = (req, res) => {
  debug('Creating room')

  if (!req.body.name || !req.body.admin_id || !req.body.coords)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  roomMethods.createRoom(req.body)
    .then(room => res.status(200).json(room))
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const updateRoom = (req, res) => {
  debug('Update room')

  roomMethods.getRoomById(req.params.id)
    .then(room => {
      if (!room.admin_id.equals(req.body.admin_id))
	return res.status(401).send({ message: 'Unauthorized'})

      roomMethods.updateRoom(room, req.body)
	.then(room => res.status(200).json(room))
	.catch(err => {
	  debug('%O', err)
	  res.status(500).send({ message: 'Internal server error.' })
	})
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })
}

const getRoom = (req, res) => {
  debug('Getting room')
  
  roomMethods.getRoomById(req.params.id, (err, room) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (room === null) return res.status(404).send({ message: 'Room not found.' });
    
    res.status(200).json(room)
  })
}

const getRooms = (req, res) => {
  debug('Getting all rooms')

  roomMethods.getRooms()
    .then(rooms => {
      res.status(200).json(rooms)
    })
    .catch(err => {
      debug('%O', err)
      res.status(500).send({ message: 'Internal server error.' })
    })  
}

module.exports = {
  createRoom: createRoom,
  updateRoom: updateRoom,
  getRooms: getRooms,
  getRoom: getRoom
}
