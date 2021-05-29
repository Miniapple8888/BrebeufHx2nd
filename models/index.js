'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

let sequelize; // Init sequelize for postgres
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log("Connecting to the database...");
(async () => {
  try {
      await sequelize.authenticate().then(() => {
        console.log("Database is connected");
      });
    } catch (err) {
      console.error(err, "Something wrong with the database");
    }
})();

module.exports = {sequelize};
