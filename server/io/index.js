'use strict'

let io = require('socket.io')
const jwtSecret = require('../../configs/').jwt.secret
const jwt = require('jsonwebtoken')
const op = require('./operations')
const msgM = require('../models/message/methods')
const debug = require('debug')('rtm')

const init = server => io = io(server)
const getKey = (obj, value) => Object.keys(obj).find(key => obj[key] === value)

const checkToken = token => new Promise((res, rej) => {
  jwt.verify(token, jwtSecret, err => err
	     ? rej(err)
	     : res())
})

let clients = {} // key: user_id, value: socket.id

const start = () => {
  io.on('connection', socket => {
    debug('Client connected')
    
    socket.auth = false

    // Check user authorization
    setTimeout(() => { if (!socket.auth) socket.disconnect(true) }, 30000) 

    const authentication = data => {
      debug('User authentication')

      if (!data.token) {
	// TODO: proc event error
	console.log('RTM | Missing token (' + socket.id + ')')
	disconnect();
      }

      debug('Ckecking token')
      checkToken(data.token)
	.then(() => {
	  clients[data.user_id] = socket.id // Add socket.id to clients list
	  socket.auth = true

	  op.joinGroupsAfterAuth(data.user_id, socket)
	    .catch(err => {
	      // TODO: proc event error
	      debug('%O', err)
	      disconnect()
	    })
	})
	.catch(err => {
	  debug('%O', err)
	  // TODO: proc event error
	  disconnect()
	})  
    }

    const disconnect = () => {
      debug('Client disconnection')
      delete clients[getKey(clients, socket.id)]
    }

    const conversationMsg = data => {
      debug('Sending conversation message')

      //      io.in(data.group_id).emit('conversation_message', data) // include sender
      socket.broadcast.to(data.group_id).emit('conversation_message', data) // exclude sender
      
      msgM.createMessage(data)
	.catch(err => console.log('rtm | ' + err))
    }

    const roomMsg = data => {
      debug('Sending room message to %o', data.room_id)

      console.log('Room message: ' + data)
      
      socket.broadcast.to(data.room_id).emit('room_message', data)
     // io.in(data.room_id).emit(data.room_id, data)
    }
    
    const joinRoom = data => {
      debug('Joining room')

      console.log('Joining room: ' + data)
      
      socket.join(data.room_id)
    }

    const leaveRoom = data  => {
      debug('Leaving room')

      socket.leave(data.room_id)
    }

    socket.on('auth', authentication)
    socket.on('disconnect', disconnect)
    socket.on('conversation_message', conversationMsg)
    socket.on('join_room', joinRoom)
    socket.on('room_message', roomMsg)
    socket.on('leave_room', leaveRoom)
  })
}

const joinGroup = (userId, groupId) => {
  if (clients[userId] !== undefined)
    io.sockets.connected[clients[userId]].join(groupId)
}

const leaveGroup = (userId, groupId) => {
  if (clients[userId] !== undefined)
    io.sockets.connected[clients[userId]].leave(groupId)
}

module.exports = {
  init: init,
  start: start,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup
}
