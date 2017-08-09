const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const crypt = (pwd, cb) => {
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return cb(err)

    bcrypt.hash(pwd, salt, (err, hash) => {
      return cb(err, hash)
    })
  })
}

const compare = (pwd, userPwd, cb) => {
  bcrypt.compare(pwd, userPwd, (err, isPwdMatch) => {
    if (err) return cb(err)
    return cb (null, isPwdMatch)
  })
}

module.exports = {
  crypt: crypt,
  compare: compare
}
