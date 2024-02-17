// const uuid = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world',
    location: { lat: 40.7484474, lng: -73.9871516 },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
]

function getPlaceById(req, res, next) {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(dummyPlace => dummyPlace.id === placeId)
  if (!place) {
    return next(
      new HttpError('Could not found place for the provided id!', 404)
    )
  }
  res.status(200).json({ place })
}

function getPlacesByUserId(req, res, next) {
  const userId = new Date()
  const userPlaces = DUMMY_PLACES.filter(
    dummyPlace => dummyPlace.creator === userId
  )
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
  } catch (error) {
    return next(error)
  }

  const createdPlace = {
    id: new Date(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace)

  res.status(201).json({ place: createdPlace })
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
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById
}
