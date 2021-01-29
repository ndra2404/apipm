const knex = require('../config/database');

/**
 * Get API configuration stored on the database
 *
 * @return {Object}
 */
const get = async () => {
  return new Promise((resolve, reject) => {
    knex
      .from('api')
      .then(resp => {
        let items = {};
        resp.map((item, index) => {
          let key = item.api_code.replace('API_', '').toLowerCase();
          items[key] = item.api_value;
        });
        resolve(items);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = { get };
