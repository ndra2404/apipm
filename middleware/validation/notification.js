const { body, validationResult } = require('express-validator');

const { response } = require('../../utils')

/**
 * Push notificatoin validation on body data
 */
const formValidation = [
  body('employeesn', 'Employee SN is required').not().isEmpty(),
  body('title', 'Title is required').not().isEmpty(),
  body('message', 'Message is required').not().isEmpty()
];

/**
 * Validate
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let messages = [];
    errors.errors.forEach(item => {
      messages.push(item.msg);
    });
    return response.error400(messages.join('\n'), errors.array(), res);
  }
  next();
};

/**
 * Leave request validation rules
 */
const notificationValidationRules = () => {
  return [formValidation, validate];
};

module.exports = { notificationValidationRules };
