const knex = require('../config/database')
const { datetime } = require('../utils')
const table = 'tbl_sub_kriteria'

/**
 * Get user information on local database by username / SN
 *
 * @param {String} username
 * @return {Object}
 */
const get = async (kriteria) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .where('kd_kriteria', kriteria)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}
const getTarget = async (kriteria) => {
  return new Promise((resolve, reject) => {
    knex
    .raw("select nilaitarget,sub_kriteria from tbl_sub_kriteria where kd_kriteria='"+kriteria+"' and is_search=1")  
    .then((data) => {
        data = data[0][0].nilaitarget+"-"+data[0][0].sub_kriteria
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}
const getNilaiBobot = async (kriteria) => {
  return new Promise((resolve, reject) => {
    knex
    .raw("select bobot from tbl_bobot where selisih='"+kriteria+"'")  
    .then((data) => {
        data = data[0][0].bobot
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}
const topup = async (params) => {
    return new Promise((resolve, reject) => {
        const sql ="call generateTrCode()";
        knex
            .raw(sql)
            .then((data) => {
                data = data[0][0][0];
                let lastcode = data.code;
                let userData = {
                    anggotaID: params.anggotaID,
                    jumlah:params.nominal,
                    transaksiNo:data.code,
                    typeTransaksi:params.typeTransaksi,
                    type:params.type,
                    statuscode:params.statuscode,
                }
                knex("transaksi")
                    .insert(userData)
                    .then((response) => {
                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err.originalError.info.message)
                    })
            })
            .catch(err => {
                reject({ message: err.originalError.message });
            });
    })
}
module.exports = { get,topup,getTarget,getNilaiBobot}
