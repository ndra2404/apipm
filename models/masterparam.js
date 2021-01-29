const knex = require('../config/database')

/**
 *
 *
 * @param {*} params
 * @return {Object}
 */
const get = async (params) => {
  return new Promise((resolve, reject) => {
    knex('tbl_setting')
      .where(params)
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = { get }
