const knex = require('../config/database');

const activeDirectoryGroup = () => {};

const userAccessAdd = () => {};

const userLeaveAdd = async row => {
  return new Promise((resolve, reject) => {
    const leaveData = {
      lea_leaveid: row.lea_leaveid,
      lea_companycode: row.lea_companycode,
      lea_leaveyear: row.lea_leaveyear,
      lea_leaverequestnumber: row.lea_leaverequestnumber,
      lea_employeesn: row.lea_employeesn,
      lea_employeename: row.lea_employeename,
      lea_supervisorsn: row.lea_supervisorsn,
      lea_createdby: row.lea_createdby,
      lea_createddate: row.lea_createddate,
      lea_statuscode: row.lea_statuscode,
      lea_leaveperiodfrom: row.lea_leaveperiodfrom,
      lea_leaveperiodto: row.lea_leaveperiodto,
      lea_workperiodefrom: row.lea_workperiodefrom,
      lea_workperiodto: row.lea_workperiodto,
      lea_leavequota: row.lea_leavequota,
      lea_quotaremaining: row.lea_quotaremaining,
      lea_leavetypecode: row.lea_leavetypecode,
      lea_leaveintervalfrom: row.lea_leaveintervalfrom,
      lea_leaveintervalto: row.lea_leaveintervalto,
      lea_leaveaddress: row.lea_leaveaddress,
      lea_contactphone: row.lea_contactphone,
      lea_contactmobile: row.lea_contactmobile,
      lea_remarks: row.lea_remarks,
      lea_changeremarks: row.lea_changeremarks,
      lea_sendtosap: row.lea_sendtosap ? row.lea_sendtosap : 0,
      lea_employeeemail: row.lea_employeeemail,
      lea_supervisoremail: row.lea_supervisoremail,
      lea_hremail: row.lea_hremail,
      lea_hrsn: row.lea_hrsn,
      lea_lastupdateby: row.lea_lastupdateby,
      lea_lastupdatedate: row.lea_lastupdatedate
    };
    knex('leave')
      .returning('lea_leaveid')
      .insert(leaveData)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err.originalError.info.message);
      });
  });
};

module.exports = {
  activeDirectoryGroup,
  userAccessAdd,
  userLeaveAdd,
};
