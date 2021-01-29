/**
 * List of month
 *
 * @param {string} month
 */
const listDate = month => {
  const month_list = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  return typeof month == 'undefined' ? month_list : month_list[parseInt(month)];
};

/**
 * Format datetime
 *
 * @param {object} datetime
 */
const formatDateTime = date => {
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * Format date
 *
 * @param {object} date
 */
const formatDate = date => {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
};

/**
 * Format range of date
 *
 * @param {string} value Date to be formated
 */
const formatDateRange = value => {
  const date_start = value.startDate.split('T');
  const date_end = value.endDate.split('T');
  const date1 = date_start[0].split('-');
  const date2 = date_end[0].split('-');
  if (date1[0] == date2[0]) {
    if (date1[2] == date2[2]) {
      return `${date2[2]} ${listDate(date1[1])} ${date1[0]}`;
    } else if (date1[1] == date2[1]) {
      return `${date1[2]} - ${date2[2]} ${listDate(date1[1])} ${date1[0]}`;
    } else {
      return `${date1[2]} ${listDate(date1[1])} - ${date2[2]} ${listDate(date2[1])} ${date1[0]}`;
    }
  } else {
    return `${date1[2]} ${listDate(date1[1])} ${date1[0]} - ${date2[2]} ${listDate(date2[1])} ${
      date2[0]
    }`;
  }
};

/**
 * Convert date string from BAPI (YYYYMMDD)
 *
 * @param {date} string
 */
const convertDate = date => {
  const year = date.substr(0, 4);
  const month = parseInt(date.substr(4, 2));
  const day = date.substr(6, 2);
  return day + ' ' + listDate(month) + ' ' + year;
};

/**
 * Get age number from a date (YYYYMMDD)
 *
 * @param {dob} string
 */
const getAge = dob => {
  var year = Number(dob.substr(0, 4));
  var month = Number(dob.substr(4, 2)) - 1;
  var day = Number(dob.substr(6, 2));
  var today = new Date();
  var age = today.getFullYear() - year;
  if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
    age--;
  }
  return age;
};

module.exports = { listDate, formatDateTime, formatDate, formatDateRange, convertDate, getAge };
