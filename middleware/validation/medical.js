const { body, validationResult } = require('express-validator')

const { GetMedicalMaster } = require('../../libs/bapi/medicalmaster')
const { jwt } = require('../../middleware')
const { medicalModel } = require('../../models')
const { response, string } = require('../../utils')

/**
 * Medical request request validation on Form
 */
const fieldRequiredValidation = [
  body('statuscode', 'Medical status is required').not().isEmpty(),
  body('totalamount', 'Total amount is required').not().isEmpty(),
  body('medicaltype', 'Medical type is required').not().isEmpty(),
  body('costtype', 'Cost type is required').not().isEmpty(),
  body('amount', 'Amount item is required').not().isEmpty(),
  body('receiptdate', 'Receipt date is required').not().isEmpty(),
  body('relationcode', 'Relation code is required').not().isEmpty(),
  body('relationnumber', 'Relation number is required').not().isEmpty(),
]

/**
 *
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const fieldCustomValidation = async (req, res, next) => {
  const body = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let messages = []
    errors.errors.forEach((item) => {
      messages.push(item.msg)
    })
    return response.error400(messages.join('\n'), errors.array(), res)
  }
  // Data is not an array if only 1 items, so we need to convert to an array
  if (!Array.isArray(body.medicaltype)) {
    body.medicaltype = [body.medicaltype]
    body.costtype = [body.costtype]
    body.amount = [body.amount]
    body.receiptdate = [body.receiptdate]
    body.relationcode = [body.relationcode]
    body.relationnumber = [body.relationnumber]
  }
  const nowDate = new Date()
  for (let i = 0; i < body.medicaltype.length; i++) {
    receiptDate = new Date(body.receiptdate[i])
    diffTime = Math.abs(receiptDate - nowDate)
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (receiptDate > nowDate) {
      return response.error400('Receipt date is not valid', [], res)
    } else if (diffDays > 45) {
      return response.error400(
        'Receipt back date cannot more than > 45 days',
        [],
        res,
      )
    }
  }
  next()
}

/**
 * Medical data validaton with SAP
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const sapValidation = async (req, res, next) => {
  const body = req.body
  let error = ''
  let medical = await GetMedicalMaster(req.decoded)
  let isOpticalLense = 0
  let isSoftLense = 0
  // Data is not an array if only 1 items, so we need to convert to an array
  if (!Array.isArray(body.medicaltype)) {
    body.medicaltype = [body.medicaltype]
    body.costtype = [body.costtype]
    body.amount = [body.amount]
    body.receiptdate = [body.receiptdate]
    body.relationcode = [body.relationcode]
    body.relationnumber = [body.relationnumber]
  }
  for (let i = 0; i < body.medicaltype.length; i++) {
    switch (body.costtype[i]) {
      case 'CPLNS':
        isOpticalLense = isOpticalLense + 1
        if (medical.qlens_used > 0) {
          return response.error400(
            'You have requested Optical Lense in this year (SAP)',
            [],
            res,
          )
        }
        break
      case 'CPSLE':
        isSoftLense = isSoftLense + 1
        if (medical.qslen_used > 0) {
          return response.error400(
            'You have requested Soft Lense in this year (SAP)',
            [],
            res,
          )
        }
        break
      case 'CPFRM':
        if (medical.qfram_used > 0) {
          return response.error400(
            'You have requested Optical Frame in this year (SAP)',
            [],
            res,
          )
        }
        break
      case 'CDENT':
        if (medical.qdent == medical.qdent_used) {
          return response.error400(
            'Your dental quota has been exhausted (SAP)',
            [],
            res,
          )
        }
        break
    }
  }
  if (medical.emp_admin_email == '' || medical.emp_admin_fi_email == '') {
    return response.error400(
      'Admin email or Finance email cannot be empty',
      [],
      res,
    )
  }
  if (isOpticalLense > 0 && isSoftLense > 0) {
    return response.error400(
      'You cannot submit Optical Lens and Soft Lens at the same time',
      [],
      res,
    )
  }
  req.medical = medical
  req.error = error
  next()
}

/**
 * Medical data validation with database record
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const databaseValidation = async (req, res, next) => {
  const body = req.body
  // Data is not an array if only 1 items, so we need to convert to an array
  if (!Array.isArray(body.medicaltype)) {
    body.medicaltype = [body.medicaltype]
    body.costtype = [body.costtype]
    body.amount = [body.amount]
    body.receiptdate = [body.receiptdate]
    body.relationcode = [body.relationcode]
    body.relationnumber = [body.relationnumber]
  }
  for (let i = 0; i < body.medicaltype.length; i++) {
    switch (body.costtype[i]) {
      case 'CPLNS':
        medicalQuota = await medicalModel.getOptical({
          sn: string.employeeSN(req.decoded.sn),
          optical_type: body.costtype[i],
        })
        if (medicalQuota.length) {
          return response.error400(
            'You have requested Soft Lense or Optical Lense in this year (DB)',
            [],
            res,
          )
        }
      case 'CPSLE':
        medicalQuota = await medicalModel.getOptical({
          sn: string.employeeSN(req.decoded.sn),
          optical_type: body.costtype[i],
        })
        if (medicalQuota.length) {
          return response.error400(
            'You have requested Soft Lense or Optical Lense in this year (DB)',
            [],
            res,
          )
        }
      case 'CPFRM':
        medicalQuota = await medicalModel.getOptical({
          sn: string.employeeSN(req.decoded.sn),
          optical_type: body.costtype[i],
        })
        if (medicalQuota.length) {
          return response.error400(
            'You have requested Optical Frame in this year (DB)',
            [],
            res,
          )
        }
    }
  }
  next()
}

/**
 * Medical request validation rules
 */
const medicalValidationRules = () => {
  return [
    jwt.checkToken,
    fieldRequiredValidation,
    fieldCustomValidation,
    sapValidation,
    databaseValidation,
  ]
}

module.exports = { medicalValidationRules }
