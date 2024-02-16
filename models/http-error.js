class HttpError extends Error {
  constructor(message, errorCode) {
    super(message) // Add a "message" property.
    this.statusCode = errorCode // Adds a "statusCode" property.
  }
}

module.exports = HttpError
