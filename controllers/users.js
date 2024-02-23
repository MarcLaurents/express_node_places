// const uuid = require('uuid')
const validate = require('../validations/inputs')
const MongoUsers = require('../database/users')

async function getUsers(req, res, next) {
  try {
    const users = await MongoUsers.getUsers()
    res.status(200).json({ users })
  } catch (error) {
    return next(error)
  }
}

async function singup(req, res, next) {
  try {
    validate.inputs(req)
    const { name, email, password } = req.body
    const createdUser = {
      id: new Date(),
      name,
      email,
      password
    }
    await MongoUsers.insertUser(createdUser)
    res.status(200).json({
      message: `User ${createdUser.name} registered successefuly`,
      user: createdUser
    })
  } catch (error) {
    return next(error)
  }
}

async function login(req, res, next) {
  try {
    validate.inputs(req)
    const { email, password } = req.body
    const identifiedUser = await MongoUsers.getUser({ email, password })
    res
      .status(200)
      .json({ message: `Wellcome ${identifiedUser.name}, login successefuly` })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getUsers,
  singup,
  login
}
