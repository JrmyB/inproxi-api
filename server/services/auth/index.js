'use strict'

const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const getToken = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err

    if (!user)
      res.status(401).json({ message: 'Authentication failed. Email not found.' })
    else if (user.password != req.body.password)
      res.status(401).json({ message: 'Authentication failed. Wrong password.'})
    else {
      const token = jwt.sign(user, 'secretPassPhrase', {
        expiresIn: '1d'
      })

      res.status(200).json({
        token: token
      })
    }
  })
}

const checkToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token)
    return res.status(403).send({ message: 'No token provided.' })
  else {
    jwt.verify(token, 'secretPassPhrase', (err, decoded) => {
      if (err)
        return res.json({ message: 'Failed to authenticate token.'})
      else {
        req.decoded = decoded
        next()
      }
    })
  }
}

module.exports = {
  getToken : getToken,
  checkToken : checkToken
}
