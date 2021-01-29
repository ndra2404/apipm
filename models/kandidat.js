const knex = require('../config/database')
const { datetime } = require('../utils')
const table = 'tbl_kandidat'

/**
 * Get user information on local database by username / SN
 *
 * @param {String} username
 * @return {Object}
 */
const get = async () => {
  return new Promise((resolve, reject) => {
    knex(table)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}

const getPelamar = async () => {
  return new Promise((resolve, reject) => {
    knex("tbl_pelamar")
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}
const getrank = async () => {
  return new Promise((resolve, reject) => {
    knex("vw_hitung")
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err.originalError.info.message)
      })
  })
}
const insertBobot = async (bobot) => {
  return new Promise((resolve, reject) => {
    knex("tbl_perhitungan")
      .insert(bobot)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const updatepelamar = async (id,bobot) => {
  return new Promise((resolve, reject) => {
    knex('tbl_pelamar')
    .where('id_pelamar', '=', id)
    .update(bobot)
    .then((response) => {
      resolve(response)
    })
    .catch((err) => {
      reject(err)
    })
  })
}
const insertPelamar = async (bobot) => {
  return new Promise((resolve, reject) => {
    knex("tbl_pelamar")
      .insert(bobot)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const getTransaksi = async (kd_kandidat,kd_kriteria,kd_sub_kriteria) => {
  return new Promise((resolve, reject) => {
    knex.select('nilai').from('tbl_transaksi').leftJoin('tbl_kandidat', 'tbl_kandidat.kd_kandidat', 'tbl_transaksi.kd_kandidat')
    .where({
        "tbl_transaksi.kd_kandidat": kd_kandidat,
        "kd_kriteria":  kd_kriteria,
        "kd_sub_kriteria":kd_sub_kriteria
    })
    .then((data)=>{
      resolve(data);
    }) 
    .catch(err => {
      reject({ message: err.originalError.info.message });
    });
  })
}
function getValue(idpelamar,variable,nilai,istring){
  let sql ="";
  sql ="select "+variable+" as nilaivalue from tbl_pelamar where id_pelamar='"+idpelamar+"' ";
  if(istring==1){
    sql += " And "+variable+" = '"+nilai+"' ";
  }else{
    var two = nilai.split("|");
    if(two[1]){
      sql += " And "+variable+" "+two[0]+" and "+variable+" "+two[1]+""
    } else{
      sql += " And "+variable+" "+two[0]+" "
    }
  }
  return new Promise((resolve, reject) => {
    knex
    .raw(sql)
    .then((data)=>{
      let status =[];
      if(data[0][0]){
        status=variable+"-"+nilai+"-"+data[0][0].nilaivalue;
      }else{
        status=false;
      }
      resolve(status);
    }) 
    .catch(err => {
      reject({ message: err.originalError.info.message });
    });
  })
}
const truncateperhitungan = async (params) => {
  return new Promise((resolve, reject) => {
      const sql ="truncate table tbl_perhitungan";
      knex
          .raw(sql)
          .then((data) => {
            resolve(data)
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
module.exports = { get,getTransaksi,updatepelamar,getPelamar,getValue,insertBobot,getrank,insertPelamar,truncateperhitungan}
