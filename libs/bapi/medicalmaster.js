const request = require('request');
const xml2js = require('xml2js');

/**
 * Format xml medical quota data
 *
 * @param {*} xml Object xml medical quota data
 */
const formatMedicalMaster = function(xml) {
  let data = {};

  // Quota used
  const item_used = xml._empQuotaUsed;
  if (typeof item_used[0].MedQuotaUsedItem != 'undefined') {
    const item_used_total = item_used[0].MedQuotaUsedItem.length;
    for (i = 0; i < item_used_total; i++) {
      const quota_type = (
        item_used[0].MedQuotaUsedItem[i].quotused_quot_type + ''
      ).toLocaleLowerCase();
      const quota_value = item_used[0].MedQuotaUsedItem[i].quotused_quot_amount[0];
      data[quota_type + '_used'] = quota_value;
    }
  }

  // Quota total
  // TODO: Quota reduction except outpatient
  const item = xml._empQuota;
  if (typeof item[0].EmpQuota != 'undefined') {
    const item_total = item[0].EmpQuota.length;
    for (i = 0; i < item_total; i++) {
      const quota_type = (item[0].EmpQuota[i].emp_quottype_code + '').toLowerCase();
      const quota_value = item[0].EmpQuota[i].emp_wage_type_amount_of_payment[0];
      data[quota_type] = quota_value;
    }

    // Quota outpatient
    if (data['qout1_used']) {
      data['qout1'] = parseInt(data['qout1']) - parseInt(data['qout1_used']);
    }
    if (data['qout2_used']) {
      data['qout2'] = parseInt(data['qout2']) - parseInt(data['qout2_used']);
    }
    
    // Quota optical
    let qfram_used = data['qfram_used'] ? parseInt(data['qfram_used']) : 0;
    let qlens_used = data['qlens_used'] ? parseInt(data['qlens_used']) : 0;
    let qslen_used = data['qlens_used'] ? parseInt(data['qlens_used']) : 0;
    data['qfram'] = parseInt(data['qfram']) - qfram_used;
    if (qlens_used > 0) {
      data['qoptc'] = data['qfram'] + (parseInt(data['qlens']) - qlens_used)
    } else if (qslen_used > 0) {
      data['qoptc'] = data['qfram'] + (parseInt(data['qslen']) - qslen_used)
    }
    else {
      data['qoptc'] = data['qfram'] + (parseInt(data['qlens']) - qlens_used)
    }
  }

  // Medical type
  const item_medical_type = xml._medicalType;
  if (typeof item_medical_type[0].MedicalType != 'undefined') {
    data['medical_type'] = [];
    const item_medical_type_total = item_medical_type[0].MedicalType.length;
    for (i = 0; i < item_medical_type_total; i++) {
      data['medical_type'].push({
        type_code: item_medical_type[0].MedicalType[i].medical_type_code[0],
        type_name: item_medical_type[0].MedicalType[i].medical_type_name[0],
        type_valid_from: item_medical_type[0].MedicalType[i].medical_type_valid_from[0],
        type_valid_to: item_medical_type[0].MedicalType[i].medical_type_valid_to[0]
      });
    }
  }

  // Medical cost type
  const item_medical_cost_type = xml._costType;
  if (typeof item_medical_cost_type[0].MedicalCostType != 'undefined') {
    data['medical_cost_type'] = [];
    const item_medical_cost_type_total = item_medical_cost_type[0].MedicalCostType.length;
    for (i = 0; i < item_medical_cost_type_total; i++) {
      data['medical_cost_type'].push({
        cost_type_medical_type_code:
          item_medical_cost_type[0].MedicalCostType[i].cost_type_medical_type_code[0],
        cost_type_code: item_medical_cost_type[0].MedicalCostType[i].cost_type_code[0],
        cost_type_name: item_medical_cost_type[0].MedicalCostType[i].cost_type_name[0],
        cost_type_valid_from: item_medical_cost_type[0].MedicalCostType[i].cost_type_valid_from[0],
        cost_type_valid_to: item_medical_cost_type[0].MedicalCostType[i].cost_type_valid_to[0]
      });
    }
  }

  // Others data
  const keys = Object.keys(xml);
  for (const key of keys) {
    if (key.substr(0, 4) == 'emp_') {
      data[key] = xml[key][0];
    }
  }

  return data;
};

/**
 * Get employee's medical information (medical type, quota, cost, etc)
 *
 * @param {object} params - Object data of {employeesn, date, company}
 */
const GetMedicalMaster = params => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    if (month.length < 2) month = '0' + month;
    let day = '' + date.getDate();
    if (day.length < 2) day = '0' + day;
    const dateFormatted = `${date.getFullYear()}${month}${day}`;
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/medicalMaster.asmx/GetMedicalMaster`,
      method: 'POST',
      body: `SN=${params.sn}&DATE=${dateFormatted}&COMP_CODE=${params.company}`
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      let item = {};
      xml2js.parseString(body, function(error, result) {
        if (result.MedicalMasterItem.emp_name != '' && typeof result != 'undefined') {
          item = formatMedicalMaster(result.MedicalMasterItem);
        }
      });
      resolve(item);
    });
  });
};

module.exports = { GetMedicalMaster };
