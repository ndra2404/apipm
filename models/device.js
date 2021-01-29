const knex = require('../config/database')
const { datetime } = require('../utils')
const table = 'userdevice'

/**
 * Get list of device token from user
 *
 * @param {Object} params - Object of {employeesn, token}
 * @return {Object}
 */
const get = async (params) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .modify((query) => {
        if (params.employeesn) {
          query.where('ud_sn', params.employeesn)
        } else if (params.token) {
          query.where('ud_token', params.token)
        }
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * Create or update token for user's devices
 *
 * @param {Object} row - Object of {employeesn, token, device}
 * @return {Object}
 */
const create = async (row) => {
  const tokens = await get({ token: row.token })
  console.log(row.token);
  return new Promise((resolve, reject) => {
    const tokenData = {
      ud_token: row.token,
      ud_device: row.device ? row.device : '',
      ud_active: row.active,
    }
    if (row.employeesn) {
      tokenData.ud_sn = row.employeesn
    }
    let token = knex(table).returning('ud_token')
    if (tokens.length > 0) {
      tokenData.ud_updateddate = datetime.formatDateTime(new Date())
      token.where('ud_token', row.token).update(tokenData)
    } else {
      tokenData.ud_createddate = datetime.formatDateTime(new Date())
      tokenData.ud_updateddate = datetime.formatDateTime(new Date())
      token.insert(tokenData)
    }
    token
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        const error = {
          message: err.originalError
            ? err.originalError.info.message
            : err.message,
        }
        reject(error)
      })
  })
}

module.exports = { get, create }
