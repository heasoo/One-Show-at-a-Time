const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// set up DB connection
var config = require('../config/config.js');
var seqConfig = config[env];

let sequelize;
if (seqConfig.url) {
  sequelize = new Sequelize(seqConfig.url);
  console.log('connecting to db...');
} else {
  sequelize = new Sequelize(
    seqConfig.database, seqConfig.username, seqConfig.password, seqConfig
  );
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;