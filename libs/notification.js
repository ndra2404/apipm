const request = require('request')
const { deviceModel } = require('../models')

/**
 * Send push notification to user
 *
 * @param {Object} params - Object of {employeesn, title, message, data}
 * @return {Object}
 */
const push = async (params) => {
  const sn = typeof params.employeesn != 'undefined' ? params.employeesn : '0'
  let response = {
    success: false,
    message: 'Device token not found',
    details: 'User does not have registered device token',
  }
  const tokens = await deviceModel.get({ employeesn: sn })
  if (tokens.length) {
    tokens.forEach((item, i) => {
      const requestData = {
        to: item.ud_token,
        notification: {
          body: params.body,
          title: params.title,
          content_available: true,
          priority: 'high',
        },
        data: params.data,
      }
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${process.env.FIREBASE_KEY}`,
        },
        url: `https://fcm.googleapis.com/fcm/send`,
        method: 'POST',
        json: requestData,
      }
      request(options)
    })
    return {
      success: true,
      message: 'Successfully send notification',
    }
  }
  return response
}

module.exports = {
  push,
}
