const { validationResult } = require('express-validator')
function inputs(body) {
  const errors = validationResult(body)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data!', 422)
    )
  }
}

module.exports = {
  inputs
}
