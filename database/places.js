require('dotenv').config({ path: 'env/.env' })
const MongoClient = require('mongodb').MongoClient

const MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL
const client = new MongoClient(MONGO_DATABASE_URL)

const HttpError = require('../models/http-error')

async function getPlaces() {
  await client.connect()
  const db = client.db()
  const places = await db.collection('places').find().toArray()
  if (!places.length) {
    const error = new HttpError('Could not find places in database!', 404)
    throw error
  }
  return places
}

async function getPlaceById(id) {
  await client.connect()
  const db = client.db()
  const places = await db.collection('places').find({ id }).toArray()
  if (!places.length) {
    const error = new HttpError('Could not find places in database!', 404)
    console.log(error)
    throw error
  }
  return places
}

async function getPlaceByUserId(id)

async function insertPlace(place) {
  try {
    await client.connect()
    const db = client.db()
    const result = db.collection('places').insertOne(place)
    // client.close()
    return result
  } catch (error) {
    console.log(error)
    return next(new HttpError(error.message, error.status))
  }
}

module.exports = {
  getPlaces,
  getPlaceById,
  insertPlace
}
