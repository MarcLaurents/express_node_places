require('dotenv').config({ path: 'env/.env' })
const axios = require('axios')
const HttpError = require('../models/http-error')

const API_GEOCONDING_URL = process.env.API_GEOCONDING_URL
const API_GEOCONDING_KEY = process.env.API_GEOCONDING_KEY

async function getCoordsForAddress(address) {
  // return { location: { lat: 40.7484474, lng: -73.9871516 } } // DUMMY
  const { data } = await axios.get(
    `${API_GEOCONDING_URL}/search?q=${encodeURIComponent(
      address
    )}&api_key=${API_GEOCONDING_KEY}`
  )
  if (!data.length || !data[0].lat || !data[0].lon) {
    const error = new HttpError(
      'Could not find location for specified address!',
      422
    )
    throw error
  }
  const coordinates = { lat: data[0].lat, lon: data[0].lon }

  return coordinates
}

module.exports = getCoordsForAddress
