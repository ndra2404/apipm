const knex = require('../config/database');
const { datetime } = require('../utils');
const table = 'saldo'


/** 
 * Express model for assessment
 * @module model/assessment
*/
const getSaldo = async (username) => {
    return new Promise((resolve, reject) => {
      knex(table)
        .where('anggota_id', username)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err.originalError.info.message)
        })
    })
  }
  const getSaldoagent = async (username) => {
    console.log(username)
    return new Promise((resolve, reject) => {
      knex("saldoagent")
        .where('agenId', username)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err.originalError.info.message)
        })
    })
  }
module.exports = { 
    getSaldo,
    getSaldoagent
}