require('dotenv').config({ path: 'env/.env' })
const MongoClient = require('mongodb').MongoClient

const MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL
const client = new MongoClient(MONGO_DATABASE_URL)

const HttpError = require('../models/http-error')

async function getUsers() {
  await client.connect()
  const db = client.db()
  const users = await db.collection('users').find({}).toArray()
  if (!users.length) {
    const error = new HttpError('There is no users registered in data base!')
    throw error
  }
  await client.close()
  return users
}

async function getUser({ email, password }) {
  await client.connect()
  const db = client.db()
  const user = await db.collection('users').find({ email, password }).toArray()
  if (!user) {
    const error = new HttpError('Invalid login!', 401)
    throw error
  }
  await client.close()
  return user
}

async function insertUser(user) {
  await client.connect()
  const db = client.db()
  const existentUser = await db
    .collection('users')
    .findOne({ email: user.email })
  if (existentUser) {
    const error = new HttpError('Email already registered in database!')
    throw error
  }
  await db.collection('users').insertOne(user)
}

async function updateUser(user) {
  await client.connect()
  const db = client.db()
  let userToUpdate = await db.collection('users').find({ email: user.email })
  if (!userToUpdate) {
    const error = new HttpError('User not found in database', 404)
    throw error
  }
  userToUpdate = user
  await client.close()
  return user
}

module.exports = {
  getUsers,
  getUser,
  insertUser,
  updateUser
}
