'use strict';
const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('./index.js'); // Index js file in models folder

class Language extends Model {};
Language.init({
  language: {
    type: DataTypes.STRING,
    unique: true,
  }
}, {
  sequelize,
  modelName: 'Language',
  timestamps: false,
});

module.exports = Language;