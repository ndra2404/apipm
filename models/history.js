const knex = require('../config/database');

/**
 * Get history from user (leave and medical)
 * Add new data from table skrining (assessment)
 *
 * @param {Object} params object of {employeesn, year, companycode, offset, limit}
 * @return {Object}
 */
const get = async params => {
  return new Promise((resolve, reject) => {
    const offset = params.offset == 0 ? 0: params.offset * params.limit ;
    const username = params.username
    const limit = params.offset == 0 ? params.limit : parseInt(offset) + parseInt(params.limit) - 1;
    const sql = `
    select * from transaksi t left join anggota a on a.anggotaID=t.anggotaID where a.username='${username}' and t.deleted_at is null order by tglTransaksi desc limit  ${offset} , ${limit}`;
    knex
      .raw(sql)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject({ message: err.originalError.message });
      });
  });
};

module.exports = { get };
