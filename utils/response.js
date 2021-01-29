/**
 * Response message
 *
 * @param {String} message
 * @param {Object} reply
 * @return {Object}
 */
const message = async (message, reply) => {
  return reply.json({
    success: true,
    message: message,
  })
}

/**
 * Response data
 *
 * @param {String} message
 * @param {Object} reply
 * @return {Object}
 */
const data = async (data, reply) => {
  return reply.json({
    success: true,
    data: data,
  })
}

/**
 * Response error with 400 HTTP status code (Bad request)
 *
 * @param {String} message
 * @param {Object} error
 * @param {Object} reply
 * @return {Object}
 */
const error400 = async (message, error, reply) => {
  return reply.status(400).json({
    success: false,
    message: message,
    error: error,
  })
}

/**
 * Response error with 401 HTTP status code (Unauthorized)
 *
 * @param {String} message
 * @param {Object} error
 * @param {Object} reply
 * @return {Object}
 */
const error401 = async (message, error, reply) => {
  return reply.status(401).json({
    success: false,
    message: message,
    error: error,
  })
}

/**
 * Response error with 500 HTTP status code (Server error)
 *
 * @param {String} message
 * @param {Object} error
 * @param {Object} reply
 * @return {Object}
 */
const error500 = async (message, error, reply) => {
  return reply.status(500).json({
    success: false,
    message: message,
    error: error,
  })
}

module.exports = {
  message,
  data,
  error400,
  error401,
  error500,
}
