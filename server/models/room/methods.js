'use strict'

const Room = require('./')

const getRoomById = id => new Promise((resolve, reject) => {
  Room.findById(id)
    .then(room => resolve(room))
    .catch(err => reject(err))
})

const createRoom = data => new Promise((resolve, reject) => {
  const room = new Room({
    name: data.name,
    password: data.password || undefined
  })

  room.save()
    .then(room => resolve(room))
    .catch(err => reject(err))
})

const updateRoom = (room, data) => new Promise((resolve, reject) => {
  room.name = data.name || room.name
  room.password = data.password || room.password
  room.area_id = data.area_id || room.area_id

  room.save()
    .then(room => resolve(room))
    .catch(err => reject(err))
})

const deleteRoom = room => new Promise((resolve, reject) => {
  Room.remove({ _id: room._id })
    .then(room => resolve(room))
    .catch(err => reject(err))
})

module.exports = {
  getRoomById: getRoomById,
  createRoom: createRoom,
  updateRoom: updateRoom,
  deleteRoom: deleteRoom
}
