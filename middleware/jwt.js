const jwt = require('jsonwebtoken');

/**
 * Validate JWT token
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next
 */
const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: res.__('auth.token_invalid')
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: res.__('auth.token_not_provided')
    });
  }
};

module.exports = {
  checkToken: checkToken
};
