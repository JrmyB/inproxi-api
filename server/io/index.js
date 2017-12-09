'use strict'

let io = require('socket.io')
const jwtSecret = require('../../configs/').jwt.secret
const jwt = require('jsonwebtoken')
const op = require('./operations')
const msgM = require('../models/message/methods')
const debug = require('debug')('RTM')

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
      socket.broadcast.to(data.group_id).emit('message', data) // exclude sender
      
      msgM.createMessage(data)
	.catch(err => console.log('RTM | ' + err))
    }

    const roomMsg = data => {
      debug('Sending room message')

      io.in('epitech_exp').emit('epitech_exp', data)
    }
    
    const joinRoom = () => {
      debug('Joining room')
      
      socket.join('epitech_exp')
    }

    socket.on('auth', authentication)
    socket.on('disconnect', disconnect)
    socket.on('conversation_message', conversationMsg)
    socket.on('join_room', joinRoom)
    socket.on('room_message', roomMsg)
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
