const md5 = require('md5')
//const readXlsxFile = require("read-excel-file/node")

const knex = require('../config/database')
const { email, nonsap } = require('../libs')
const templateUtils = require('../utils/template')
const {
    kriteriaModel,
    subKriteriaModel
  } = require('../models')
const { agent } = require('supertest')
const insertCreteria = async (req, res) => {
    let code = await kriteriaModel.getLastCode("K");
    let simpanData = {
        kd_kriteria :code.lastcode,
        kriteria:req.body.kriteria,
        jenis:req.body.jenis
    }
    const createKre = await kriteriaModel.createKriteria(simpanData)
    res.json({
        success: true,
        message: "Berhasil dibuat",
    })
}
const insertSubCreteria = async (req, res) => {
    let code = await kriteriaModel.getLastCode("KS");

    let simpanData = {
        kd_sub_kriteria :code.lastcode,
        kd_kriteria:req.body.kd_kriteria,
        sub_kriteria:req.body.sub_kriteria,
        CF:req.body.cf,
        SF:req.body.sf,
        nilaitarget:req.body.nilaitarget
    }
    const createKre = await kriteriaModel.createSubKriteria(simpanData)
    res.json({
        success: true,
        message: "Berhasil dibuat",
    })
}
const getCreteria = async (req, res) => {
    const data = await kriteriaModel.getCreteria();
    res.json({
        success: true,
        message: "success",
        jenis:"kriteria",
        data:data
    })
}
const getSubCreteria = async (req, res) => {
    const data = await kriteriaModel.getSubCreteria(req.params);
    res.json({
        success: true,
        jenis:"subkriteria",
        message: "success",
        data:data
    })
}
module.exports = {
    insertCreteria,getSubCreteria,getCreteria,insertSubCreteria
}