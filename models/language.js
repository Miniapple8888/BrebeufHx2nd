'use strict';
const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('./index.js'); // Index js file in models folder

class LearningLanguage extends Model {};
LearningLanguage.init({
  language: DataTypes.STRING,
}, {
  sequelize,
  timestamps: false,
  modelName: 'LearningLanguage',
});

class SpokenLanguage extends Model {};
SpokenLanguage.init({
  language: DataTypes.STRING,
}, {
  sequelize,
  timestamps: false,
  modelName: 'SpokenLanguage',
});

module.exports = {LearningLanguage, SpokenLanguage};