'use strict'

const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const authentication = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(404).send(err)

    if (!user)
      return res.status(401).json({ message: 'Authentication failed. Email not found.' })
    if (user.password != req.body.password)
      return res.status(401).json({ message: 'Authentication failed. Wrong password.'})

    const token = jwt.sign(user, 'pssphrs', {
      expiresIn: '1d'
    })

    res.status(200).json({
      token: token
    })

  })
}

const checkToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token)
    return res.status(401).send({
      status: 'Unauthorized',
      message: 'No token provided.'
    })
  else {
    jwt.verify(token, 'pssphrs', (err, decoded) => {
      if (err)
        return res.status(401).json({
          status: 'Unauthorized',
          message: 'Invalid token.'
        })
      else {
        req.decoded = decoded
        next()
      }
    })
  }
}

module.exports = {
  authentication : authentication,
  checkToken : checkToken
}
