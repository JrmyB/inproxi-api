'use strict'

let io = require('socket.io')
const jwtSecret = require('../../configs/').jwt.secret
const jwt = require('jsonwebtoken')
const op = require('./operations')
const msgM = require('../models/message/methods')

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
    console.log('RTM | Client connected (' + socket.id + ')')
    socket.auth = false

    // Check user authorization
    setTimeout(() => { if (!socket.auth) socket.disconnect(true) }, 30000) 

    const authentication = data => {
      console.log('RTM | Authentication (' + socket.id + ')')
      
      if (!data.token) {
	console.log('RTM | Missing token (' + socket.id + ')')
	disconnect();
      }
      
      checkToken(data.token)
	.then(() => {
	  console.log('RTM | Client authenticated (' + socket.id + ')')
	  clients[data.user_id] = socket.id // Add socket.id to clients list
	  socket.auth = true

	  op.joinGroupsAfterAuth(data.user_id, socket)
	    .catch(err => {
	      console.log('RTM | ' + err)
	      disconnect()
	    })
	})
	.catch(err => {
	  console.log('RTM | ' + err)
	  disconnect()
	})  
    }

    const disconnect = () => {
      console.log('RTM | Client disconnected (' + socket.id + ')')
      delete clients[getKey(clients, socket.id)]
    }

    const privateMsg = data => {
      io.in(data.group_id).emit('private_message', data)

      console.log('Data1:')
      console.log(data)
      
      msgM.createMessage({
	conversation_id: data.group_id,
	content: data.message,
	author: data.from
      }).catch(err => console.log('RTM | ' + err))
    }

    socket.on('auth', authentication)
    socket.on('disconnect', disconnect)
    socket.on('private_message', privateMsg)
  })
}

const joinGroup = (userId, groupId) => {
  console.log('User ID: ' + userId)
  console.log('Group ID: ' + groupId)
  
  console.log(clients[userId])

  if (clients[userId])
    clients[userId].join(groupId)
}

const leaveGroup = (userId, groupId) => {
  if (clients[userId])
    clients[userId].leave(groupId)
}

module.exports = {
  init: init,
  start: start,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup
}

// socket.on('join_room', data => socket.join(data.room_id))
// socket.on('leave_room', data => socket.leave(data.room_id))

// socket.on('join_room', data => socket.join(data.room_id))
// socket.on('leave_room', data => socket.leave(data.room_id))

// socket.on('private_message', data => {
//   console.log('Connected clients: ' + clients)

//   console.log('Private message: from ' + data.from
// 		  + ', to ' + data.to + ', msg ' + data.message)

//   console.log('Sending message to:' + clients[data.to])

//   io.sockets.connected[clients[data.to]].emit('private_message', data)
// })

