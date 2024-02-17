// const uuid = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const MongoDatabase = require('../database/places')

async function getPlaces(req, res, next) {
  try {
    const places = await MongoDatabase.getPlaces()
    res.json({ places })
  } catch (error) {
    return next(error)
  }
}

async function getPlaceById(req, res, next) {
  try {
    const placeId = req.params.pid
    const place = await MongoDatabase.getPlaceById(placeId)
    res.status(200).json({ place })
  } catch (error) {
    return next(error)
  }
}

async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid
  const userPlaces = await 
  if (!userPlaces || !userPlaces.length) {
    return next(
      new HttpError('Could not found places for the provided user id!', 404)
    )
  }
  res.status(200).json(userPlaces)
}

async function createPlace(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data!', 422)
    )
  }
  const { title, description, address, creator } = req.body
  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
    const createdPlace = {
      id: 1,
      title,
      description,
      location: coordinates,
      address,
      creator
    }
    await MongoDatabase.insertPlace(createdPlace)
    res.status(201).json({ place: createdPlace })
  } catch (error) {
    return next(error)
  }
}

function updatePlaceById(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data!', 422)
    )
  }
  const { title, description } = req.body
  const placeId = req.params.pid
  const updatedPlace = {
    ...DUMMY_PLACES.find(dummyPlace => dummyPlace.id === placeId)
  }
  const placeIndex = DUMMY_PLACES.findIndex(
    dummyPlace => dummyPlace.id === placeId
  )
  updatedPlace.title = title
  updatedPlace.description = description
  DUMMY_PLACES[placeIndex] = updatedPlace
  res.status(200).json({ place: updatedPlace })
}

function deletePlaceById(req, res, next) {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(dummyPlace => dummyPlace.id === placeId)) {
    return next(new HttpError('Could not find a place for that id.', 404))
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(dummyPlace => dummyPlace.id != placeId)
  res.status(200).json({ message: 'Place deleted!' })
}

module.exports = {
  getPlaces,
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById
}
