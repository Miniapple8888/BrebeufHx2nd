'use strict';
const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('./index.js'); // Index js file in models folder

class Interest extends Model {};
Interest.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
        notNull: {
          msg: "Please enter interest name."
        }
      }
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Interest',
});

module.exports = Interest;

  // Interest.associate = (models) => {
  //   Interest.belongsToMany(models.User, { 
  //     through: 'UserInterest',
  //     as: "users",
  //     foreignKey: "interest_id" });
  // }
  // return Interest;