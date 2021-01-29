const request = require('request');
const xml2js = require('xml2js');

/**
 * Get list of employee's inferior
 *
 * @param {string} positioncode - The employee's position code
 */
const GetEmployeeInferior = positioncode => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/persadmin.asmx/GetEmployeeInferior`,
      method: 'POST',
      body: `POS_ID=${positioncode}`
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      let item = [];
      xml2js.parseString(body, function(error, result) {
        if (result.ListInferior.inferiors && typeof result != 'undefined') {
          const keys = Object.keys(result.ListInferior.inferiors[0].Inferior);
          for (const key of keys) {
            item.push(result.ListInferior.inferiors[0].Inferior[key].employeesn[0]);
          }
        }
      });
      resolve(item);
    });
  });
};

module.exports = { GetEmployeeInferior };
