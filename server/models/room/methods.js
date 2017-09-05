'use strict';

const Room = require('./');
const userMethods = require('../user/methods');

function getRoomById(id, cb) {
  Room.findById(id, (err, room) => {
    if (err) return cb(err, null);
    cb(null, room);
  });
};

function createRoom(data, cb) {
  let room = new Room({
    name: data.name,
    owner: data.owner
  })

  room.save((err, room) => {
    if (err) return cb(err, null);
    cb(null, room);
  });
};

module.exports = {
  getRoomById: getRoomById,
  createRoom: createRoom,
};
