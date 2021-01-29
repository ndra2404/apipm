const request = require('request');
const xml2js = require('xml2js');

const string = require('../../utils/string');

/**
 * Format xml employee data
 *
 * @param {*} xml Object xml employee data
 */
const formatAllDataEmployee = function(xml) {
  const emp = {};
  const family = xml._family;
  const employment = xml._employment;
  const education = xml._education;
  let emp_couple = [];
  let emp_children = [];
  let emp_employment = [];
  let emp_education = [];
  if (typeof family[0].EmployeeFamily != 'undefined') {
    const family_length = family[0].EmployeeFamily.length;
    for (i = 0; i < family_length; i++) {
      if (family[0].EmployeeFamily[i].fam_relationcode == '1') {
        let couple_data = {
          fam_begin: family[0].EmployeeFamily[i].fam_begin[0],
          fam_end: family[0].EmployeeFamily[i].fam_end[0],
          fam_relationcode: family[0].EmployeeFamily[i].fam_relationcode[0],
          fam_familyname: family[0].EmployeeFamily[i].fam_familyname[0],
          fam_sexcode: family[0].EmployeeFamily[i].fam_sexcode[0],
          fam_birthplace: family[0].EmployeeFamily[i].fam_birthplace[0],
          fam_birthdate: family[0].EmployeeFamily[i].fam_birthdate[0]
        };
        emp_couple.push(couple_data);
      } else if (family[0].EmployeeFamily[i].fam_familynumber != '') {
        let children_data = {
          fam_begin: family[0].EmployeeFamily[i].fam_begin[0],
          fam_end: family[0].EmployeeFamily[i].fam_end[0],
          fam_relationcode: family[0].EmployeeFamily[i].fam_relationcode[0],
          fam_familyname: family[0].EmployeeFamily[i].fam_familyname[0],
          fam_sexcode: family[0].EmployeeFamily[i].fam_sexcode[0],
          fam_birthplace: family[0].EmployeeFamily[i].fam_birthplace[0],
          fam_birthdate: family[0].EmployeeFamily[i].fam_birthdate[0]
        };
        emp_children.push(children_data);
      }
    }
  }
  if (typeof employment[0].EmployeeEmployment != 'undefined') {
    const employment_length = employment[0].EmployeeEmployment.length;
    for (i = 0; i < employment_length; i++) {
      let employment_data = {
        epl_employername: employment[0].EmployeeEmployment[i].epl_employername[0],
        epl_city: employment[0].EmployeeEmployment[i].epl_city[0],
        epl_startdate: employment[0].EmployeeEmployment[i].epl_startdate[0],
        epl_enddate: employment[0].EmployeeEmployment[i].epl_enddate[0],
        epl_tmtgroup: employment[0].EmployeeEmployment[i].epl_tmtgroup[0],
        epl_positionname: employment[0].EmployeeEmployment[i].epl_positionname[0]
      };
      emp_employment.push(employment_data);
    }
  }
  if (typeof education[0].EmployeeEducation != 'undefined') {
    const education_length = education[0].EmployeeEducation.length;
    for (i = 0; i < education_length; i++) {
      let education_data = {
        eed_degreecode: education[0].EmployeeEducation[i].eed_degreecode[0],
        eed_majorcode: education[0].EmployeeEducation[i].eed_majorcode[0],
        eed_institutelocation: education[0].EmployeeEducation[i].eed_institutelocation[0],
        eed_countrycode: education[0].EmployeeEducation[i].eed_countrycode[0],
        eed_startdate: education[0].EmployeeEducation[i].eed_startdate[0],
        eed_enddate: education[0].EmployeeEducation[i].eed_enddate[0],
        eed_durationamount: education[0].EmployeeEducation[i].eed_durationamount[0],
        eed_durationcode: education[0].EmployeeEducation[i].eed_durationcode[0],
        eed_certificatecode: education[0].EmployeeEducation[i].eed_certificatecode[0]
      };
      emp_education.push(education_data);
    }
  }
  const keys = Object.keys(xml);
  for (const key of keys) {
    if (key.substr(0, 4) == 'emp_') {
      emp[key] = xml[key][0];
    }
  }
  emp.emp_couple = emp_couple;
  emp.emp_children = emp_children;
  emp.emp_employment = emp_employment;
  emp.emp_education = emp_education;
  return emp;
};

/**
 * Get time overview range of date from user
 *
 * @param {object} params - Object data of {employee_sn, start_date, end_date}
 */
const GetDateStatus = params => {
  return new Promise((resolve, reject) => {
    const body = string.serialize({
      SN: params.employeesn,
      StartDate: params.startdate,
      EndDate: params.enddate
    });
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/zhr.asmx/GetDateStatus`,
      method: 'POST',
      body: body
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      xml2js.parseString(body, function (error, result) {
        if (typeof result != "undefined") { 
          const timeoverview = result.DateStatus._timeoverview;
          if (typeof timeoverview[0].TimeOverview != 'undefined') {
            const length = timeoverview[0].TimeOverview.length;
            let items = [];
            let totalFree = 0;
            let totalWorkingDay = 0;
            for (i = 0; i < length; i++) {
              item = timeoverview[0].TimeOverview[i];
              items.push({
                validitydate: item.VALIDITYDATE[0],
                regularhours: item.REGULARHOURS[0],
                regularbegin: item.REGULARBEGIN[0],
                regularend: item.REGULAREND[0],
                nonworking: item.NONWORKING[0].toLowerCase(),
                regworktimeext: item.REGWORKTIMETEXT[0].toLowerCase(),
                attendancehours: item.ATTENDANCEHOURS[0],
                absencehours: item.ABSENCEHOURS[0],
                overtimehours: item.OVERTIMEHOURS[0]
              });
              if (item.NONWORKING[0].toLowerCase() == 'x') {
                totalFree = totalFree + 1;
              } else {
                totalWorkingDay = totalWorkingDay + 1;
              }
            }
            resolve({
              totalFree: totalFree,
              totalWorkingDay: totalWorkingDay,
              data: items
            });
          }
        }
      });
    });
  });
};

/**
 * Get employee data including family, education, employment, etc
 *
 * @param {string} employeesn - The Employee's SN
 */
const GetAllDataEmployee = employeesn => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/zhr.asmx/GetAllDataEmployee`,
      method: 'POST',
      body: `SN=${employeesn}`
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      let item = {};
      xml2js.parseString(body, function (error, result) {
        if (typeof result != "undefined") {
          if (result.EmployeeAllItem.emp_employeesn != '') {
            item = formatAllDataEmployee(result.EmployeeAllItem);
          }
        }
      });
      resolve(item);
    });
  });
};

/**
 * Get employee data for self assessment
 * 
 * @param {string} employeesn - The Employee's SN
 */
const GetDataAssessmentEmployee = employeesn => {
  return new Promise( async (resolve, reject) => {
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //url: `${process.env.HCMS_URL}/services/GetAllDataAssessmentEmployee.asmx/GetDataEmployee`,
      //url service for assessment
      url: `http://10.2.8.30:2025/services/GetAllDataAssessmentEmployee.asmx/GetDataEmployee`,
      method: 'POST',
      body: `SN=${employeesn}`
    };
    await request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      let item = {};
      xml2js.parseString(body, function (error, result) {
        if (typeof result != "undefined") {
          if (result.EmployeeAssessmentItem.eai_employeesn != '') {
            item = {
              emplSN: result.EmployeeAssessmentItem.eai_employeesn,
              emplName: result.EmployeeAssessmentItem.eai_employeename,
              emplPersAdmin: result.EmployeeAssessmentItem.eai_persadmin,
              emplAdminGroup: result.EmployeeAssessmentItem.eai_admingroup,
              emplEmail: result.EmployeeAssessmentItem.eai_employeemail,
              emplSuperiorSN: result.EmployeeAssessmentItem.eai_superiorsn,
              emplSuperiorName: result.EmployeeAssessmentItem.eai_superiorname,
              emplSuperiorMail: result.EmployeeAssessmentItem.eai_superiormail,
              emplHRSN: result.EmployeeAssessmentItem.eai_hradminsn,
              emplHRName: result.EmployeeAssessmentItem.eai_hradminname,
              emplHRMail: result.EmployeeAssessmentItem.eai_hradminmail
            };
          }
        }
      });
      resolve(item);
    });
  });
};

module.exports = { GetDateStatus, GetAllDataEmployee, GetDataAssessmentEmployee };
