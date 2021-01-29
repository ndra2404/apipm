const request = require('request')
const xml2js = require('xml2js')
const string = require('../../utils/string')

/**
 * Get remaining leave quota from employee
 *
 * @param {string} employeesn - The employee's SN
 */
const GetTimeQuote = employeesn => {
  return new Promise((resolve, reject) => {
    const date = new Date()
    let month = '' + (date.getMonth() + 1)
    if (month.length < 2) month = '0' + month
    let day = '' + date.getDate()
    if (day.length < 2) day = '0' + day
    const dateFormatted = `${date.getFullYear()}${month}${day}`
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/leave.asmx/GetTimeQuote`,
      method: 'POST',
      body: `EMPLOYEE_SN=${employeesn}&DEDUCTDATE=${dateFormatted}&LEAVETYPE=`,
    }
    request(options, (error, response, body) => {
      if (error) {
        reject({ message: error })
      }
      let item = {}
      xml2js.parseString(body, function(error, result) {
        const keys = Object.keys(result.LeaveQuoteItem)
        for (const key of keys) {
          if (key.substr(0, 1) != '_') {
            item[key] = result.LeaveQuoteItem[key][0]
          }
        }
      })
      resolve(item)
    })
  })
}

/**
 * Create absence on SAP
 *
 * @param {object} params - Object data of {employeesn, absence_type, startdate, enddate}
 */
const createAbsence = params => {
  return new Promise((resolve, reject) => {
    const body = string.serialize({
      EMPLOYEE_SN: params.employee_sn,
      ABSENCE_TYPE: params.type,
      START: params.startdate,
      END: params.enddate,
    })
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/leave.asmx/createAbsence`,
      method: 'POST',
      body: body,
    }
    request(options, (error, response, body) => {
      if (error) {
        reject(error)
      }
      let item = {}
      xml2js.parseString(body, function(error, result) {
        if (result.BapiReturn) {
          item = {
            type: result.BapiReturn.Type[0],
            message: result.BapiReturn.Message[0],
          }
        }
        if (item.type == '' && item.message == '') {
          resolve(item)
        } else {
          resolve(item)
        }
      })
      resolve(body)
    })
  })
}

/**
 * Create absence for TMS on SAP
 *
 * @param {object} params - Object data of {employeesn, absence_type, startdate, enddate, func}
 */
const createAbsenceTms = params => {
  return new Promise((resolve, reject) => {
    const body = string.serialize({
      EMPLOYEE_SN: params.employee_sn,
      ABSENCE_TYPE: params.type,
      START: params.startdate,
      END: params.enddate,
      FUNC: params.func,
    })
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/leave.asmx/createAbsenceTms`,
      method: 'POST',
      body: body,
    }
    request(options, (error, response, body) => {
      if (error) {
        reject(error)
      }
      let item = {}
      xml2js.parseString(body, function(error, result) {
        if (result.BapiReturn) {
          item = {
            type: result.BapiReturn.Type[0],
            message: result.BapiReturn.Message[0],
          }
        }
        if (item.type == '' && item.message == '') {
          resolve(item)
        } else {
          resolve(item)
        }
      })
      resolve(body)
    })
  })
}

module.exports = { GetTimeQuote, createAbsence, createAbsenceTms }
