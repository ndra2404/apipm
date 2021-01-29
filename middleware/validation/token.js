const { body, validationResult } = require('express-validator')

const response = require('../../utils/response')

/**
 * Leave request validation on Form
 */
const formValidation = [body('token', 'Token is required').not().isEmpty()]

/**
 * Validate
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const validate = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let messages = []
    errors.errors.forEach((item) => {
      messages.push(item.msg)
    })
    return response.error400(messages.join('\n'), errors.array(), res)
  }
  next()
}

/**
 * Leave request validation rules
 */
const tokenValidationRules = () => {
  return [formValidation, validate]
}

module.exports = { tokenValidationRules }
