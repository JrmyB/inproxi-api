'use strict'

const FriendRequest = require('./')
const User = require('../user/')

const getFriendRequestById = id => new Promise((resolve, reject) => {
  FriendRequest.findById(id, (err, friendRequest) => err
			 ? reject(err)
			 : resolve(friendRequest))
})

const addFriendRequest = (to, from, msg) => new Promise((resolve, reject) => {
  const friendRequest = new FriendRequest({
    from: from,
    to: to,
    message: msg || ''
  });

  friendRequest.save()
    .then(friendRequest => resolve(friendRequest))
    .catch(err => reject(err))
})

const deleteFriendRequest = (friendRequest) => new Promise((resolve, reject) => {
  FriendRequest.remove({ _id: friendRequest._id })
    .then(() => resolve())
    .catch(err => reject(err))
})

const acceptFriendRequest = (friendRequest, status) => new Promise((resolve, reject) => {
  User.find({$or: [{ _id: friendRequest.from }, { _id: friendRequest.to }]})
    .then(users => {
      if (users === undefined) reject()

      if(users[0]._id.equals(friendRequest.from)) {
	users[0].friends.push(friendRequest.to)
	users[1].friends.push(friendRequest.from)
      } else {
	users[0].friends.push(friendRequest.from)
	users[1].friends.push(friendRequest.to)
      }

      Promise.all([users[0].save(), users[1].save()])
	.then(() => resolve())
	.catch(err => reject(err))
    })
    .catch(err => reject(err))
})

const getFriendRequests = (outgoing, userId) => new Promise((resolve, reject) => {
  const type = outgoing
      ? { from: userId }
      : { to: userId }

  FriendRequest.find(type)
    .then(friendRequests => resolve(friendRequests))
    .catch(err => reject(err))
})
							    
module.exports = {
  getFriendRequestById: getFriendRequestById,
  addFriendRequest: addFriendRequest,
  deleteFriendRequest: deleteFriendRequest,
  acceptFriendRequest: acceptFriendRequest,
  getFriendRequests: getFriendRequests
};
