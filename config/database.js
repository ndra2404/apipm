'use strict';

const env = process.env.NODE_ENV || 'development';
const knexfile = require('../knexfile')[env];
const knex = require('knex')(knexfile);

module.exports = knex;