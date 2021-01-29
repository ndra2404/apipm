/**
 * Serialize object data
 *
 * @param {object} obj - Object data
 */
const serialize = function(obj) {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

/**
 * Format employee's SN with leading zero
 *
 * @param {string} sn - The employee's SN
 */
const employeeSN = sn => {
  return sn.padStart(8, '0');
};

module.exports = { serialize, employeeSN };
