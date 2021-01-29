const md5 = require('md5')
//const readXlsxFile = require("read-excel-file/node")

const knex = require('../config/database')
const { email, nonsap } = require('../libs')
const templateUtils = require('../utils/template')
// const { GetAllDataEmployee } = require('../libs/bapi/zhr')
// const { GetEmployeeProfilInfo } = require('../libs/bapi/employee')
// const { GetScheduleList } = require('../libs/bapi/workschedule')
const {
  userModel,
  historyModel,
} = require('../models')
const { string, response } = require('../utils')
const { formatDateTime } = require('../utils/datetime')
const { template } = require('handlebars')

/**
 * Get data user profile
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object}
 */
const profile = async (req, res) => {
  try {
    let data = {}
    const userInfo = await userModel.getBySN(req.decoded.name)
    data=userInfo;
    let employee = {}
    employee = data;
    res.send(employee)
  } catch (error) {
    error = error.message ? error.message : error
    console.log(`profile err (${req.decoded.sn}) >> ${error}`)
    res.status(500).json({ success: false, message: error })
  }
}

/**
 * Get data user history (leave and medical)
 * 
 * @param {Object} req
 * @param {Object} res
 * @return {Object}
 */
const history = async function (req, res) {
  try {
    const activity = await historyModel.get({
      username: req.decoded.name,
      type: req.query.type ? req.query.type : 'leave',
      offset: req.query.offset ? req.query.offset : 0,
      limit: req.query.limit ? req.query.limit : 10,
    })
    res.json({
      success: true,
      data: activity[0],
      page: req.query.offset,
    })
  } catch (error) {
    const message = error ? error.message : res.__('general.failed_get')
    console.log(`activity err (${req.decoded.sn}) >> ${message}`)
    response.error500(message, [], res)
  }
}

const createagent = async (req,res) => {
  try {
      const userData={
        agenname:req.body.nama,
        agenttelp:req.body.noHp,
        alamat:req.body.alamat,
        ktp:req.body.ktp,
        username:req.body.username,
        password:req.body.password
      }
    let cek = await userModel.createAgent(userData);
    res.send({ 
      success: true, 
      message: "Agent Created",
    }) 
  } catch (error) {
    const message = error.message ? error.message : 'Failed to check user role'
    return ({error: message})
  }
}

module.exports = {
  profile,
  createagent
}
