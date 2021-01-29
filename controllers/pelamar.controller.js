const md5 = require('md5')
//const readXlsxFile = require("read-excel-file/node")

const knex = require('../config/database')
const { email, nonsap } = require('../libs')
const templateUtils = require('../utils/template')
const {
    kriteriaModel,
    subKriteriaModel,
    kandidatModel
  } = require('../models')
const { agent } = require('supertest')
const insertPelamar = async (req, res) => {
    let simpanData = {
        nama_pelamar :req.body.nama_pelamar,
        jenjang:req.body.jenjang,
        lama_bekerja:req.body.lama_bekerja,
        pisikotes :req.body.pisikotes,
        interview1:req.body.interview1,
        interview2:req.body.interview2,
        test_teknik :req.body.test_teknik,
    }
    const createKre = await kandidatModel.insertPelamar(simpanData)
    if(createKre){
        res.json({
            success: true,
            message: "Berhasil dibuat",
        })
    }else{
        res.json({
            success: false,
            message: "Gagal dibuat",
        })
    }   
}
const updatePelamar = async (req, res) => {
    let simpanData = {
        test_teknik :req.body.test_teknik,
        jenjang:req.body.jenjang,
        lama_bekerja:req.body.lama_bekerja,
        pisikotes :req.body.pisikotes,
        interview1:req.body.interview1,
        interview2:req.body.interview2
    }
    const createKre = await kandidatModel.updatepelamar(req.params.id,simpanData)
    if(createKre){
        res.json({
            success: true,
            message: "Berhasil diubah",
        })
    }else{
        res.json({
            success: false,
            message: "Gagal diubah",
        })
    }   
}
const getPelamar = async (req, res) => {
    const data = await kandidatModel.getPelamar();
    res.json({
        success: true,
        message: "success",
        jenis:"pelamar",
        data:data
    })
}
module.exports = {
    insertPelamar,getPelamar,updatePelamar
}