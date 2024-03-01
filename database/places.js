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
  const place = await db.collection('places').findOne({ id })
  if (!place) {
    const error = new HttpError('Could not find places in database!', 404)
    throw error
  }
  return place
}

async function getPlacesByUserId(id) {
  await client.connect()
  const db = client.db()
  const userPlaces = await db
    .collection('places')
    .find({ creator: id })
    .toArray()
  if (!userPlaces.length) {
    const error = new HttpError('Could not find user places in database!', 404)
    throw error
  }
  return userPlaces
}

async function insertPlace(place) {
  await client.connect()
  const db = client.db()
  const existentPlace = await db
    .collection('places')
    .findOne({ location: place.location })
  if (existentPlace) {
    const error = new HttpError(
      'Could not register location, already registered in data base!'
    )
    throw error
  }
  await db.collection('places').insertOne(place)
}

async function updatePlace(place) {
  await client.connect()
  const db = client.db()
  const placetoUpdate = await db.collection('places').find({ id: place.pid })
  if (!placetoUpdate) {
    const error = new HttpError('Could not find place with provided id!')
    throw error
  }
  placetoUpdate.description = place.description
  placetoUpdate.title = place.title
  await client.close()
  return place
}

module.exports = {
  getPlaces,
  getPlaceById,
  insertPlace,
  getPlacesByUserId,
  updatePlace
}
