'use strict';

var fs        = require('fs');
var path      = require('path');
var _         = require('lodash');
var Sequelize = require('sequelize');
var dotenv    = require('dotenv');
var db        = {};
var connectString;
var sequelize;

/* ====================================================== */

dotenv.load();

connectString = 'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

sequelize = new Sequelize(connectString, {
  dialect: 'postgres',
  native: false
});

/* ====================================================== */

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

_.forEach(Object.keys(db), function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;