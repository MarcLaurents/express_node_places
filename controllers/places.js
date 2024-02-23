// const uuid = require('uuid')
const { validationResult } = require('express-validator')

const validate = require('../validations/inputs')
const getCoordsForAddress = require('../util/location')
const MongoPlaces = require('../database/places')

async function getPlaces(req, res, next) {
  try {
    const places = await MongoPlaces.getPlaces()
    res.json({ places })
  } catch (error) {
    return next(error)
  }
}

async function getPlaceById(req, res, next) {
  try {
    const placeId = req.params.pid
    const place = await MongoPlaces.getPlaceById(placeId)
    res.status(200).json({ place })
  } catch (error) {
    return next(error)
  }
}

async function getPlacesByUserId(req, res, next) {
  try {
    const userId = req.params.uid
    const userPlaces = await MongoPlaces.getPlacesByUserId(userId)
    res.status(200).json({ places: userPlaces })
  } catch (error) {
    return next(error)
  }
}

async function createPlace(req, res, next) {
  try {
    validate.inputs(req)
    const { title, description, address, creator } = req.body
    let coordinates
    coordinates = await getCoordsForAddress(address)
    const createdPlace = {
      id: 1,
      title,
      description,
      location: coordinates,
      address,
      creator
    }
    await MongoPlaces.insertPlace(createdPlace)
    res.status(201).json({ place: createdPlace })
  } catch (error) {
    return next(error)
  }
}

async function updatePlaceById(req, res, next) {
  try {
    validate.inputs(req)
    const newPlace = req.body
    const updatedPlace = await MongoPlaces.updatePlace(newPlace)
    res.status(200).json({ place: updatedPlace })
  } catch (error) {
    return next(error)
  }
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
