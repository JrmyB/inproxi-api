'use strict';

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

const getRoom = (req, res) => {
  debug('Getting room')
  
  roomMethods.getRoomById(req.params.id, (err, room) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (room === null) return res.status(404).send({ message: 'Room not found.' });
    
    res.status(200).json(room)
  })
}

module.exports = {
    createRoom: createRoom,
    getRoom: getRoom
}
