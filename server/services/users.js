'use strict'

const User = require('../models/user')
const FriendRequest = require('../models/friendRequest');

const getUsers = (req, res) => {
    User.find((err, users) => {
      if (err)
	  return res.status(500).send({ message: 'Internal server error.' })
      res.status(200).json(users)
  })
}

const getUserWithId = (req, res) => {
    if (!req.params.id)
	return res.status(422).json({ message: 'User ID required.'});

    User.findById(req.params.id, (err, user) => {
	if (err) return res.status(500).send({ message: 'Internal server error.' });
	if (user === null) return res.status(404).send();

	res.status(200).json(user)
    })
}

const getFriendsWithId = (req, res) => {
    if (!req.params.id)
	return res.status(422).json({ message: 'User ID required.'});

    User.findById(req.params.id, (err, user) => {
	if (err) return res.status(500).send({ message: 'Internal server error.' });
	if (user === null) return res.status(404).send();

	var friends = [];
	
	user.friends.forEach((user_id, index, array) => {
	    User.findById(user_id, (err, f) => {
		if (err) return res.status(500).send({ message: 'Internal server error.' });

		friends.push({
		    _id: f._id,
		    first_name: f.first_name,
		    last_name: f.last_name
		});

		if (index === user.friends.length - 1) {
		    res.status(200).send(friends);  
		}
	    });	    
	});
    });
};


// const getUserWithEmail = (req, res) => {
//     if (!req.params.email)
// 	return res.status(422).json({ message: 'User\'s email required.'})
    
//     User.findOne({ email: req.body.email }, (err, user) => {
// 	if (err) return res.status(404).send(err);
// 	res.status(200).json(user);
//     });
// }

const createUser = (req, res) => {    
    if (!req.body.first_name || !req.body.last_name
	|| !req.body.email || !req.body.password)
	return res.status(422).json({ message: 'Required field(s) missing.'})

    let user = new User({
	first_name: req.body.first_name,
	last_name: req.body.last_name,
	email: req.body.email,
	password: req.body.password
    })

    user.save((err) => {
	if (err.code === 11000) return res.status(409).json({ message: 'This email is taken. Try another.' });
	if (err) return res.status(500).send({ message: 'Internal server error.' });
		    
	res.status(200).json({
	    email: user.email,
	    first_name: user.first_name,
	    last_name: user.last_name,
	    id: user.id
	})
    })
}

const updateUserWithId = (req, res) => {
  if (!req.body.password)
    return res.status(401).json({ message: 'Password required.'})

  User.findById(req.params.id || 0, (err, user) => {
      if (err) return res.status(404).send({ message: 'Internal server error.' })

    user.comparePwd(req.body.password, (err, isMatch) => {
      if (err) return res.status(404).send(err)
      if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' })

      user.first_name = req.body.first_name || user.first_name,
      user.last_name = req.body.last_name || user.last_name,
      user.email = req.body.email || user.email

      user.save((err) => {
        if (err) return res.status(500).json({ message: 'Update failed.' })
        res.status(200).json(user)
      })
    })
  })
}

const deleteUserWithId = (req, res) => {
    if (!req.body.password)
	return res.status(401).json({ message: 'Password required.' });

    User.findById(req.params.id || 0, (err, user) => {
	if (err) return res.status(404).send({ message: 'Internal server error.' });
	
	user.comparePwd(req.body.password, (err, isMatch) => {
	    if (err)
		return res.status(404).send(err);
	    if (!isMatch)
		return res.status(401).send({ message: 'Passwords don\'t match.' });

	    User.remove({ _id: req.params.id }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Internal server error.' });
		res.status(200).json({ message: 'User deleted' })
	    });
	});
    });
}

const getFriendRequests = (req, res) => {
    const frType = req.query.outgoing
	  ? { from: req.params.id }
	  : { to: req.params.id };

    FriendRequest.find(frType, (err, frs) => {
	if (err)
	    return res.status(500).send({ message: 'Internal server error.' })
	res.status(200).json(frs)
    })
	
};

module.exports = {
    getUsers : getUsers,
    getUserWithId : getUserWithId,
    createUser : createUser,
    updateUserWithId : updateUserWithId,
    deleteUserWithId : deleteUserWithId,
    getFriendRequests: getFriendRequests, 
    getFriendsWithId: getFriendsWithId
}
