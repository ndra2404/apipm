const request = require('request');
const xml2js = require('xml2js');

/**
 * Get schedule list from employee
 *
 * @param {string} employeesn - The employee SN
 * @param {string} begindate - Begin date
 * @param {string} enddate - End date
 */
const GetScheduleList = params => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/workschedule.asmx/GetScheduleList`,
      method: 'POST',
      body: `EMPLOYEE_SN=${params.employeesn}&BEGIN_DATE=${params.begindate}&END_DATE=${params.enddate}`
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      let item = [];
      xml2js.parseString(body, function(error, result) {
        if (result.WorkscheduleitemList.Workscheduleitems && typeof result != 'undefined') {
          const item_length =
            result.WorkscheduleitemList.Workscheduleitems[0].Workscheduleitem.length;
          const ws = result.WorkscheduleitemList.Workscheduleitems[0].Workscheduleitem;
          for (i = 0; i < item_length; i++) {
            item.push({
              date: ws[i].date[0],
              startTimeWork: ws[i].startTimeWork[0],
              endTimeWork: ws[i].endTimeWork[0],
              workHours: ws[i].workHours[0],
              workschedule: ws[i].workschedule[0]
            });
          }
        }
      });
      resolve(item);
    });
  });
};

module.exports = { GetScheduleList };
