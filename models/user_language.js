'use strict';
const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('./index.js'); // Index js file in models folder


class User_Language extends Model {};
User_Language.init({
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
},
type: DataTypes.STRING,
proficiency: DataTypes.STRING,
}, {
sequelize,
modelName: 'User_Language',
timestamps: false,
});

module.exports = User_Language;