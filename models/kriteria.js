const knex = require('../config/database')
const { datetime } = require('../utils')
const table = 'tbl_kriteria'
const table2 = 'tbl_sub_kriteria'

/**
 * Get user information on local database by username / SN
 *
 * @param {String} username
 * @return {Object}
 */
const getLastCode = async (type) => {
  let sql = "";
  if(type=="K"){
    sql= "select max(right(kd_kriteria,2))+1 lastcode from tbl_kriteria";
  }else{
    sql= "select max(right(kd_sub_kriteria ,3))+1 lastcode from tbl_sub_kriteria";
  }
  return new Promise((resolve, reject) => {
    knex
      .raw(sql)
      .then(data => {
        data = data[0][0];
        let lastnumber = data.lastcode;
        let jml =0;
        if(lastnumber<10){
          jml = 1;
          if(type=="KS"){
            jml=2;
          }
          data.lastcode = type+getcode(jml)+lastnumber;
        }else if(lastnumber<100){
          jml = 0;
          if(type=="KS"){
            jml=1;
          }
          data.lastcode = type+getcode(jml)+lastnumber;
        }else{
          jml = 0;
          data.lastcode = type+getcode(jml)+lastnumber;
        }
        resolve(data);
      })
      .catch(err => {
        reject({ message: err });
      });
  })
}
const createKriteria = async (kriteria) => {
  return new Promise((resolve, reject) => {
    knex(table)
      .insert(kriteria)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const createSubKriteria = async (subkriteria) => {
  return new Promise((resolve, reject) => {
    knex(table2)
      .insert(subkriteria)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const getCreteria = async () => {
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
const getSubCreteria = async (params) => {
  return new Promise((resolve, reject) => {
    knex(table2)
      .where("kd_kriteria",params.kd)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
        throw err
      })
  })
}
function getcode(jumlah){
  let code = "";
  for(let i=0;i<jumlah;i++){
    code =code+"0";
  }
  return code;
}
module.exports = { getLastCode,createKriteria,createSubKriteria,getCreteria,getSubCreteria}
