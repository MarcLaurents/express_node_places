const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
function inputs(body) {
  const errors = validationResult(body)
  if (!errors.isEmpty()) {
    console.log(errors)
    const {
      errors: [error]
    } = errors
    throw new HttpError(
      `Invalid ${error.path}` ||
        'Invalid inputs passed, please check your data!',
      422
    )
  }
}

module.exports = {
  inputs
}
