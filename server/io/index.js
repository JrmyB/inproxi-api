'use strict'

let io = require('socket.io')
const jwtSecret = require('../../configs/').jwt.secret
const jwt = require('jsonwebtoken');

const init = server => io = io(server)
const getKey = (obj, value) => Object.keys(obj).find(key => obj[key] === value)

const checkToken = token => new Promise((res, rej) => {
  jwt.verify(token, jwtSecret, err => err
	     ? rej()
	     : res())
})

const start = () => {
  let clients = {} // key: user_id, value: socket.id

  io.on('connection', socket => {
    socket.auth = false

    // Check user authorization
    setTimeout(() => { if (!socket.auth) socket.disconnect(true) }, 1000);
    
    socket.on('auth', data => {
      if (!data.token) socket.disconnect(true)
      
      checkToken(data.token)
   	.then(() => {
   	  clients[data.user_id] = socket.id // Add socket.id to clients list
   	  socket.auth = true
	})
   	.catch(() => socket.disconnect(true))
    })
    
    socket.on('disconnect', () => delete clients[getKey(clients, socket.id)])
    socket.on('join_room', data => socket.join(data.room_id))
    socket.on('leave_room', data => socket.leave(data.room_id))
    socket.on('private_message', data =>
	      io.sockets.connected[clients[data.to]].emit('private_message', data))
    socket.on('room_message', data => io.in(data.room_id).emit('room_message', data))
  })
}

module.exports = {
  init: init,
  start: start
}

