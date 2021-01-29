const md5 = require('md5')
const knex = require('../config/database')
const templateUtils = require('../utils/template')
const {
  kriteriaModel,
  subKriteriaModel,
  kandidatModel
  } = require('../models')
const { agent } = require('supertest')
const doHitung = async (req, res) => {
  const kriteria = await kriteriaModel.getCreteria();
  const keys = Object.keys(kriteria)
  var rkriteria = [];
  const truncatep = await kandidatModel.truncateperhitungan("");
  for (const key of keys) {
    const subkriteria = await subKriteriaModel.get(kriteria[key].kd_kriteria)
    const subkriterias = Object.keys(subkriteria)
    var rsubkriteria = [];
    var rnilai =[];
    const kandidat = await kandidatModel.getPelamar();
    const okandidat = Object.keys(kandidat);
    var rkandidat = []
    for (const key3 of okandidat) {
      for (const key2 of subkriterias) {
        nilaival = await kandidatModel.getValue(kandidat[key3].id_pelamar,kriteria[key].kriteria,subkriteria[key2].sub_kriteria,subkriteria[key2].is_string)
        nilaitarget =await subKriteriaModel.getTarget(kriteria[key].kd_kriteria);
        nilaitarget = nilaitarget.split("-");
        if(nilaival!=false){
          nilaip = nilaival.split("-");
          gap =parseInt(subkriteria[key2].nilaitarget)-parseInt(nilaitarget);
          bobot = await subKriteriaModel.getNilaiBobot(gap);
          rkandidat.push({
            "namakandidat":kandidat[key3].nama_pelamar,
            "sub_kriteria":subkriteria[key2].sub_kriteria,
            "nilai_pelamar":nilaip[2],
            "nilai":subkriteria[key2].nilaitarget,
            "nilaitarget":nilaitarget[0],
            "gap":gap,
            "bobot": bobot
          }); 
          let simpanData = {
              kd_kriteria :kriteria[key].kd_kriteria,
              kd_sub_kriteria:subkriteria[key2].kd_sub_kriteria,
              bobot:bobot,
              id_pelamar:kandidat[key3].id_pelamar
          }
          const createKre = await kandidatModel.insertBobot(simpanData);
        }
      }
    }
    nilaitarget2 =await subKriteriaModel.getTarget(kriteria[key].kd_kriteria);
    nilaitarget2 = nilaitarget2.split("-");
    rkriteria.push({
      "kd_kriteria":kriteria[key].kd_kriteria,
      "kriteria":kriteria[key].kriteria,
      "target":nilaitarget2[1],
      //"nilai_bobot":kriteria[key].nilai_bobot,
      "nilai":rkandidat,
      //"kandidat":rkandidat
    }); 
  }
  ranking =await kandidatModel.getrank();
  res.json({
      success: true,
      message: rkriteria,
      rank :ranking
  })
}
module.exports = {
    doHitung
}