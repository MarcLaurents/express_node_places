const express = require('express')
const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places')
const usersRoutes = require('./routes/users')
const HttpError = require('./models/http-error')

const app = express()

// Middleware Setup
app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route!', 404)
  return next(error)
})

// Error Handler Middleware Setup
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res
    .status(error.statusCode || 500)
    .json({ message: error.message || 'An unknow error occurred!' })
})

// Port
app.listen(5000)
