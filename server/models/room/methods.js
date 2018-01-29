'use strict'

const Room = require('./')

const getRoomById = id => new Promise((resolve, reject) => {
  console.log('lolilol')

  Room.findById(id)
    .then(room => {
      console.log('haha')
      console.log(room)
      resolve(room)
    })
    .catch(err => reject(err))
})

const getRooms = () => new Promise((resolve, reject) => {
  Room.find({})
    .exec()
    .then(rooms => resolve(rooms))
    .catch(err => reject(err))
})

const createRoom = data => new Promise((resolve, reject) => {
  console.log(data.coords)
  
  const room = new Room({
    name: data.name,
    password: data.password || undefined,
    admin_id: data.admin_id,
  })

  room.coords = room.coords.concat(data.coords)

  room.save()
    .then(room => resolve(room))
    .catch(err => reject(err))
})

const updateRoom = (room, data) => new Promise((resolve, reject) => {
  room.name = data.name || room.name

  if (data.coords) {
    room.coords = []
    room.coords = room.coords.concat(data.coords)
  }
  
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
  getRooms: getRooms,
  createRoom: createRoom,
  updateRoom: updateRoom,
  deleteRoom: deleteRoom
}
