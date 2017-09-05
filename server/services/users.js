'use strict'

const userMethods = require('../models/user/methods');
const frMethods = require('../models/friendRequest/methods');

const getUser = (req, res) => {
  userMethods.getUserById(req.params.id, (err, user) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (user === null) return res.status(404).send({ message: 'User not found.' });

    res.status(200).json(user);
  });
}

const createUser = (req, res) => {    
  if (!req.body.first_name || !req.body.last_name
      || !req.body.email || !req.body.password)
    return res.status(422).json({ message: 'Required field(s) missing.'})

  userMethods.createUser(req.body, (err, user) => {
    if (err && err.code === 11000) return res.status(409).json({ message: 'This email is taken. Try another.' });
    if (err) return res.status(500).send({ message: 'Internal server error.' });

    res.status(200).json(user);
  });
}

const updateUser = (req, res) => {
  if (!req.body.password)
    return res.status(422).json({ message: 'Required password missing.'})

  userMethods.getUserById(req.params.id, (err, user) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (user === null) return res.status(404).send({ message: 'User not found.' });

    user.comparePwd(req.body.password, (err, isMatch) => {
      if (err) return res.status(500).send({ message: 'Internal server error.'});
      if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' })

      userMethods.updateUser(user, req.body, (err, user) => err
			     ? res.status(500).send({ message: 'Internal server error.'})
			     : res.status(200).json(user))
    });
  });
}

const deleteUser = (req, res) => {
  if (!req.body.password)
    return res.status(422).json({ message: 'Required password missing.'})
  
  userMethods.getUserById(req.params.id, (err, user) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (user === null) return res.status(404).send({ message: 'User not found.' });
    
    user.comparePwd(req.body.password, (err, isMatch) => {
      if (err) return res.status(500).send({ message: 'Internal server error.'});
      if (!isMatch) return res.status(401).send({ message: 'Passwords don\'t match.' });

      userMethods.deleteUser(user, err => {
	if (err) return res.status(500).send({ message: 'Internal server error.' });
	res.status(200).send();
      });
    });
  });
}

const getFriends = (req, res) => {
  userMethods.getUserById(req.params.id, (err, user) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    if (user === null) return res.status(404).send({ message: 'User not found.' });
  
    userMethods.getFriends(user, (err, friends) => {
      if (err) return res.status(500).send({ message: 'Internal server error.'});
      res.status(200).json(friends);
    });
  });
};

const getFriendRequests = (req, res) => {
  frMethods.getFriendRequests(req.query.outgoing, req.params.id, (err, frs) => {
    if (err) return res.status(500).send({ message: 'Internal server error.'});
    res.status(200).json(frs);
  });
};

module.exports = {
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getFriends: getFriends,
  getFriendRequests: getFriendRequests
}
