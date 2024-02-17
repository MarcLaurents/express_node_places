// const uuid = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Melo',
    email: 'test@test.com',
    password: 'test'
  },
  {
    id: 'u2',
    name: 'Matuca',
    email: 'test2@test.com',
    password: 'test2'
  }
]

function getUsers(req, res, next) {
  if (!DUMMY_USERS.length) {
    return next(new HttpError('There are not users in data base!', 404))
  }
  res.status(200).json({ users: DUMMY_USERS })
}

function singup(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data!', 422)
    )
  }

  const { name, email, password } = req.body
  const createdUser = {
    id: new Date(),
    name,
    email,
    password
  }
  const hasUser = DUMMY_USERS.find(dummyUser => dummyUser.email === email)

  if (hasUser) {
    return next(
      new HttpError('Could not create user, email already registered!', 422)
    )
  }

  DUMMY_USERS.push(createdUser)

  res.status(200).json({ user: createdUser })
}

function login(req, res, next) {
  const { email, password } = req.body
  const identifiedUser = DUMMY_USERS.find(
    dummyUser => dummyUser.email === email
  )
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError(
        'Could not identify user, credentials sem to be wrong!',
        401 // auth failed 401
      )
    )
  }

  res.status(200).json({ message: 'Loged in!' })
}

module.exports = {
  getUsers,
  singup,
  login
}
