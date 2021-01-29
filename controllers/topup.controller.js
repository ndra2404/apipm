const md5 = require('md5')
//const readXlsxFile = require("read-excel-file/node")

const knex = require('../config/database')
const { email, nonsap } = require('../libs')
const templateUtils = require('../utils/template')
const {
    agenModel,
    userModel
  } = require('../models')
const { agent } = require('supertest')
const topUp = async (req, res) => {
    const IDnumber = await userModel.getNoRek(req.body.norek,1);
    let dataTopup ={
        anggotaID:IDnumber[0].anggotaID?IDnumber[0].anggotaID:IDnumber[0].agent_id,
        nominal:req.body.nominal,
        type:req.body.type,
        typeTransaksi:req.body.typeTransaksi,
        statuscode:req.body.statuscode,
    };
    const topup = await agenModel.topup(dataTopup)
    res.json({
        success: true,
        message: "Top up success",
    })
}
module.exports = {
    topUp
}