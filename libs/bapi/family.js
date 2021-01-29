const request = require('request')
const xml2js = require('xml2js')

const { datetime } = require('../../utils')

/**
 * Format xml employee's family data
 *
 * @param {*} xml Object xml employee's family data
 */
const formatEmployeeFamily = function (xml) {
  let data = []
  for (let i = 0; i < xml.length; i++) {
    data.push({
      relationcode: xml[i].fam_relationcode[0],
      relationnumber: xml[i].fam_relationnumber[0],
      relationname: xml[i].fam_relationname[0],
      familyname: xml[i].fam_familyname[0],
      sexcode: xml[i].fam_sexcode[0],
      birthdate: xml[i].fam_birthdate[0],
      age: datetime.getAge(xml[i].fam_birthdate[0]),
    })
  }
  return data
}

/**
 * Get list of employee's family
 *
 * @param {string} employeesn - The employee's SN
 */
const GetMedicalFamilyList = (employeesn) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${process.env.HCMS_URL}/family.asmx/GetMedicalFamilyList`,
      method: 'POST',
      body: `EMPLOYEE_SN=${employeesn}`,
    }
    request(options, (error, response, body) => {
      if (error) {
        reject(error)
      }
      let item = {}
      xml2js.parseString(body, function (error, result) {
        if (typeof result != 'undefined') {
          item = formatEmployeeFamily(
            result.MedicalFamily._medicalFamilyItem[0].MedicalFamilyItem,
          )
        }
      })
      resolve(item)
    })
  })
}

module.exports = { GetMedicalFamilyList }
