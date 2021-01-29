const { body, validationResult } = require('express-validator')

const { leaveModel, leavetypeModel } = require('../../models')
const { zhr } = require('../../libs/bapi')
const { GetTimeQuote } = require('../../libs/bapi/leave')
const { jwt } = require('../../middleware')
const { response } = require('../../utils')

/**
 * Leave request validation with SAP
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const sapValidation = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let messages = []
    errors.errors.forEach((item) => {
      messages.push(item.msg)
    })
    return res.status(422).json({
      success: false,
      message: messages.join('\n'),
      errors: errors.array(),
    })
  }

  try {
    let body = req.body
    let startdate = req.body.startdate.split('-')
    let enddate = req.body.enddate.split('-')
    body.startdate =
      startdate[0] +
      '-' +
      startdate[1].padStart(2, 0) +
      '-' +
      startdate[2].padStart(2, 0)
    body.enddate =
      enddate[0] +
      '-' +
      enddate[1].padStart(2, 0) +
      '-' +
      enddate[2].padStart(2, 0)
    const paramsDateStatus = {
      employeesn: req.decoded.sn,
      startdate: body.startdate ? body.startdate.replace(/-/g, '') : '',
      enddate: body.enddate ? body.enddate.replace(/-/g, '') : '',
    }
    const paramsLeaveType = {
      leaveTypeCode: body.type,
      companyCode: req.decoded.company,
    }
    const leaveType = await leavetypeModel.getDetails(paramsLeaveType)
    const dateStatus = await zhr.GetDateStatus(paramsDateStatus)
    const quota = leaveType[0].leavequota
    if (quota != null) {
      if (dateStatus.totalWorkingDay > quota) {
        return response.error400('Not enough leave quota', [], res)
      }
    }
    const timeQuote = await GetTimeQuote(req.decoded.sn)
    // Pengecekan cuti tahunan
    if (body.type === '0100') {
      if (
        timeQuote.leave_periodfrom &&
        timeQuote.leave_periodto &&
        timeQuote.work_periodfrom &&
        timeQuote.work_periodto
      ) {
        const quotaRemaining = timeQuote.leave_quotaremaining
          ? timeQuote.leave_quotaremaining
          : 0
        let quotaTaken = 0
        let dateInRange = true
        for (i = 0; i < dateStatus.data.length; i++) {
          if (
            dateStatus.data[i].validitydate == body.startdate.replace(/-/g, '')
          ) {
            quotaTaken++
            dateInRange = true
          } else if (dateInRange) {
            if (dateStatus.data[i].nonworking != 'x') {
              quotaTaken++
            } else if (
              dateStatus.data[i].validitydate == body.enddate.replace(/-/g, '')
            ) {
              quotaTaken++
              dateInRange = false
            }
          }
        }
        if (quotaTaken > quotaRemaining) {
          return response.error400('Not enough leave quota', [], res)
        }
      } else {
        return response.error400(
          'Your leave data is not available yet on SAP',
          [],
          res,
        )
      }
    }
  } catch (error) {
    console.log(error)
  }
  next()
}

/**
 * Date validation
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const dateValidation = async (req, res, next) => {
  try {
    const body = req.body
    const sd = body.startdate.split('-') // Start date
    const ed = body.enddate.split('-') // End date
    const startDate1 = Date.parse(
      sd[0] + '-' + sd[1].padStart(2, 0) + '-' + sd[2].padStart(2, 0),
    )
    const endDate1 = Date.parse(
      ed[0] + '-' + ed[1].padStart(2, 0) + '-' + ed[2].padStart(2, 0),
    )

    const params = { sn: req.decoded.sn }
    const leaveData = await leaveModel.getLeaveData(params)

    let isAlreadyRequested = 0
    if (leaveData.length) {
      leaveData.forEach((el, i) => {
        let startDate2 = Date.parse(el.intervalfrom)
        let endDate2 = Date.parse(el.intervalto)
        if (startDate1 === endDate1) {
          if (startDate1 >= startDate2 && startDate1 <= endDate2) {
            isAlreadyRequested++
          }
        } else {
          if (
            (startDate1 >= startDate2 && startDate1 <= endDate2) ||
            (endDate1 >= startDate2 && endDate1 <= endDate2)
          ) {
            isAlreadyRequested++
          }
        }
      })
    }
    if (isAlreadyRequested > 0) {
      return response.error400(
        res.__('leave.error_date_already_requested'),
        [],
        res,
      )
    }
  } catch (error) {
    console.log(error)
  }
  next()
}

/**
 * Leave request validation on Form
 */
const formValidation = [
  body('type', 'Leave type is required').not().isEmpty(),
  body('startdate', 'Start date is required').not().isEmpty(),
  body('enddate', 'End date is required').not().isEmpty(),
  body('address', 'Address is required').not().isEmpty(),
  body('mobile', 'Mobile phone is required').not().isEmpty(),
  body('status', 'Leave status is required').not().isEmpty(),
]

/**
 * Leave request approval validation
 */
const approvalValidation = [
  body('employee_sn', 'Employee SN is required').not().isEmpty(),
  body('enddate', 'End date is required').not().isEmpty(),
  body('startdate', 'Start date is required').not().isEmpty(),
  body('type', 'Type code is required').not().isEmpty(),
]

/**
 * Validate
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const validateApproval = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let messages = []
    errors.errors.forEach((item) => {
      messages.push(item.msg)
    })
    return response.error400(messages.join('\n'), errors.array(), res)
  }
  next()
}

/**
 * Leave request validation rules
 */
const leaveValidationRules = () => {
  return [jwt.checkToken, dateValidation, formValidation, sapValidation]
}

/**
 * Leave request approval validation rules
 */
const approvalValidationRules = () => {
  return [jwt.checkToken, approvalValidation, validateApproval]
}

module.exports = { leaveValidationRules, approvalValidationRules }
