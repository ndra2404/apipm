const knex = require('../config/database')
const { datetime } = require('../utils')
const table = 'tbl_users'

/**
 * Get user information on local database by username / SN
 *
 * @param {String} username
 * @return {Object}
 */
const get = async (username) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .where('usr_userId', username)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}

/**
 * Get user information on local database by SN only
 *
 * @param {String} SN
 * @return {Object}
 */
const getBySN = async (SN) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .where('username', SN)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const getNoRek = async (norek,type) => {
  return new Promise((resolve, reject) => {
    let table ="";
    if (type==1) {
       table="anggota";
    }else{
      table="agen";
    }
    knex(table)
      .where('noRekening', norek)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}

/**
 * Create new user on local database
 *
 * @param {Object} row - Object of an user
 */
const create = async (row) => {
  return new Promise((resolve, reject) => {
    const userData = {
      usr_Name: row.usr_Name,
      usr_SN: row.usr_SN,
      usr_Email: row.usr_Email,
      usr_Domain: row.usr_Domain,
      usr_status: row.usr_status ? row.usr_status : 'Active',
      usr_LoginAttempt: row.usr_LoginAttempt ? row.usr_LoginAttempt : 0,
      usr_Type: row.usr_Type ? row.usr_Type : 'AD',
      usr_userId: row.usr_userId,
      usr_CompanyCode: row.usr_CompanyCode,
      usr_CreatedOn: datetime.formatDateTime(new Date()),
      usr_CreatedBy: row.usr_CreatedBy ? row.usr_CreatedBy : 'System',
    }
    knex(table)
      .returning('usr_id')
      .insert(userData)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}
const createAnggota = async (userData) => {
  return new Promise((resolve, reject) => {
    knex("anggota")
      .insert(userData)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err.sqlMessage)
      })
  })
}
const createAgent = async (userData) => {
  return new Promise((resolve, reject) => {
    knex("agent")
      .insert(userData)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err.sqlMessage)
      })
  })
}

/**
 * User login to local database
 *
 * @param {Object} params - Object of {username, password, company}
 * @return {Object}
 */
const login = async (params) => {
  return new Promise((resolve, reject) => {
    knex
      .from(table)
      .where('username', params.username)
      .andWhere('password', params.password)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err.originalError ? err.originalError.info.message : err.message)
      })
  })
}

/**
 * Change password on local database
 *
 * @param {Object} params - Object of { sn, password, passworld_old }
 * @return {Object}
 */
const changePassword = async (params) => {
  return new Promise((resolve, reject) => {
    let userData = {
      usr_Password: params.password,
    }
    knex
      .from(table)
      .where('usr_SN', params.sn)
      .andWhere('usr_Password', params.password_old)
      .then((response) => {
        if (response.length) {
          if (response[0].usr_Password == params.password) {
            reject('New password must be different with old password')
          }
          knex(table)
            .where({ usr_SN: params.sn })
            .returning('usr_id')
            .update(userData)
            .then((response) => {
              resolve(response)
            })
            .catch((err) => {
              const message =
                typeof err.originalError != 'undefined'
                  ? err.originalError.info.message
                  : err.message
              reject(message)
            })
        } else {
          reject('Wrong password or you are logged in with domain.')
        }
      })
  })
}

/**
 * Update login attempt on local database
 *
 * @param {Object} params - Object of { sn }
 * @return {Object}
 */
const updateLoginAttempt = async (params) => {
  return new Promise((resolve, reject) => {
    knex
      .from(table)
      .where('usr_SN', params.sn)
      .then((response) => {
        if (response.length) {
          const loginAttempt = parseInt(response[0].usr_LoginAttempt)
          let userData
          if (loginAttempt < 4) {
            userData = {
              usr_LoginAttempt: loginAttempt + 1,
            }
          } else {
            userData = {
              usr_LoginAttempt: 5,
              usr_status: 'Blocked',
            }
          }
          knex(table)
            .where({ usr_SN: params.sn })
            .returning('usr_id')
            .update(userData)
            .then((response) => {
              resolve(response)
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          resolve(response)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = { get, create, login, changePassword, updateLoginAttempt, getBySN,getNoRek,createAnggota }
