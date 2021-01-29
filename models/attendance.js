const knex = require('../config/database');

/**
 * Get list of attendance from a user
 * 
 * @param {Object} params - Object of {sn, startdate, enddate} 
 * @return {Object}
 */
const get = async params => {
  return new Promise((resolve, reject) => {
    knex
      .select(
        'BadgeLName AS employeeName',
        'EvCardNo AS cardNumber',
        'CoName AS companyName',
        'DateEntry AS entryDate',
        'Entry_time AS entryTime',
        'Exit_time AS exitTime',
        'entryDoor AS entryDoor',
        'exitDoor AS exitDoor',
        'SN',
        'totalHour',
        'LocName AS locName'
      )
      .from('attendance')
      .whereRaw('SN = ?', [params.sn])
      .andWhereRaw('DateEntry BETWEEN ? AND ?', [params.startdate, params.enddate])
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject({ message: err.originalError.message });
      });
  });
};

module.exports = { get };
