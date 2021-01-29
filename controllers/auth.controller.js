const jwt = require('jsonwebtoken')
const md5 = require('md5')

const { userModel, apiModel } = require('../models')
const { response } = require('../utils')

/**
 * User authentication with LDAP or local database
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object}
 */
const login = async (req, res) => {
  let params = {
    username: req.body.username,
    password: req.body.password
  }
  try {
        const user_login = await userModel.login({
           username: params.username,
           password: md5(params.password)
         })
        if(user_login.length>0){
          const token = signToken({
            name: req.body.username,
            level:user_login[0].isAdmin,
          })
          res.send({ token: token,level:user_login[0].isAdmin})
        }else {
          response.error401(res.__('auth.error_login_failed'), [], res)
        }
  } catch (error) {
    let message = res.__('auth.error_login_failed')
    if (error.message) {
      if (
        error.message.indexOf('TIMEOUT') >= 0 ||
        error.message.indexOf('TIMEDOUT') >= 0 ||
        error.message.indexOf('NOTFOUND') >= 0 ||
        error.message.indexOf('CONNREFUSED') >= 0
      ) {
        message = error.message
      }
    }
    response.error401(message, error, res)
  }
}
/**
 * Logout user
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object}
 */
const logout = function (req, res) {
  res.send(req.body)
}

const verify = async function (req, res) {
  response.message('Token valid', res)
}

/**
 * Generate JWT token
 *
 * @param {object} params - Object data of {username, sn, company}
 * @return {String} token
 */
const signToken = (params) => {
  const dayExpired = 1
  const token = jwt.sign(
    {
      name: typeof params.name != 'undefined' ? params.name : '',
      level: typeof params.level != 'undefined' ? params.level : '',
    },
    process.env.SECRET_KEY,
    {
      expiresIn: dayExpired * 86400,
    },
  )
  return token
}

module.exports = { login, logout, verify }
