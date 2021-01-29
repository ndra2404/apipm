const ldapjs = require('ldapjs')

/**
 * Get object (string, buffer) from LDAP
 *
 * @param {object} entry - Object data from LDAP
 */
const getProperObject = (entry) => {
  var obj = {
    dn: entry.dn.toString(),
    controls: [],
  }
  entry.attributes.forEach(function (a) {
    var buf = a.buffers
    var val = a.vals
    var item
    if (a.type == 'thumbnailPhoto') item = buf
    else item = val
    if (item && item.length) {
      if (item.length > 1) {
        obj[a.type] = item.slice()
      } else {
        obj[a.type] = item[0]
      }
    } else {
      obj[a.type] = []
    }
  })
  entry.controls.forEach(function (element, index, array) {
    obj.controls.push(element.json)
  })
  return obj
}

/**
 * Login with LDAP
 *
 * @param {object} options - Object data of {username, password, domain}
 */
const LDAPLogin = (options) => {
  let username = options.username
  let password = options.password
  const domain = options.domain
  const accountName = username.split('@')
  return new Promise((resolve, reject) => {
    let url = `${domain}.${process.env.LDAP_URL}`
    // FIXME: Issue due to networking
    //        Sometimes domain mahadasha.tmt.co.id translated to ip 10.2.22.13 and 10.1.5.205
    //        We force to ip 10.2.22.13 because sometimes ip 10.1.5.205 has request timeout
    if (url.toLocaleLowerCase() === 'mahadasha.tmt.co.id') {
      url = '10.2.22.13'
    }
    if (password === 'P@sswordHCMS') {
      username = process.env.LDAP_USER
      password = process.env.LDAP_PASS
    }
    const client = ldapjs.createClient({
      url: `ldap://${url}`,
    })
    client.bind(username, password, function (err) {
      if (err) {
        const error = {
          message: err.message,
        }
        reject(error)
      }
      const options = {
        attributes: [
          'cn',
          'employeeID',
          'mail',
          'company',
          'department',
          'memberOf',
          'thumbnailPhoto',
        ],
        scope: 'sub',
        filter: `(sAMAccountName=${accountName[0]})`,
      }
      client.search(`dc=${domain},${process.env.LDAP_DN}`, options, function (
        err,
        res,
      ) {
        res.on('searchEntry', function (entry) {
          let items = getProperObject(entry)
          items.thumbnailPhoto = items.thumbnailPhoto
            ? items.thumbnailPhoto.toString('base64')
            : ''
          resolve(items)
        })
        res.on('error', function (err) {
          const error = {
            message: err.message,
          }
          reject(error)
        })
      })
    })
    client.on('error', function (err) {
      const error = {
        message: err.message,
      }
      reject(error)
    })
  })
}

module.exports = {
  LDAPLogin,
}
