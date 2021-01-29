const request = require('request');
const xml2js = require('xml2js');

/**
 * Get employee's profile information
 *
 * @param {string} employeesn - The employee's SN
 */
const GetEmployeeProfilInfo = employeesn => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/employee.asmx/GetEmployeeProfilInfo`,
      method: 'POST',
      body: `EMPLOYEE_SN=${employeesn}`
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      let item = {};
      xml2js.parseString(body, function(error, result) {
        if (result.EmployeeInfoItem.emp_name != '' && typeof result != 'undefined') {
          const keys = Object.keys(result.EmployeeInfoItem);
          for (const key of keys) {
            if (key.substr(0, 4) == 'emp_') {
              item[key] = result.EmployeeInfoItem[key][0];
            }
          }
        }
      });
      resolve(item);
    });
  });
};

module.exports = { GetEmployeeProfilInfo };
