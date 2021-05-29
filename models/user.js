'use strict';
const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('./index.js'); // Index js file in models folder

class User extends Model {};
User.init({
    firstName: {
      type: DataTypes.STRING,
      isAlpha: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your first name.'
        },
        len: {
          args: [2, 20],
          msg: "Must be between 2 to 20 characters.",
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      isAlpha: true,
      notNull: true,
      validate: {
        len: {
          args: [2, 20],
          msg: "Must be between 2 to 20 characters.",
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      notNull: true,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Must be a valid email.",
        }
      },
    },
    // TODO: Validate password before entering
    passwordHash: {
      type: DataTypes.STRING,
      notNull: true,
      //is: /^[0-9a-f]{64}$/i
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    lastLoggedIn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    loggedIn: {
      type: DataTypes.BOOLEAN,
      notNull: false,
      defaultValue: false
    },
    profilePicURL: {
      type: DataTypes.STRING,
      notNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
});

module.exports = User;

  // User.associate = (models) => {
  //   User.belongsToMany(models.Interest, { 
  //     through: 'UserInterest',
  //     as: "interests",
  //     foreignKey: "user_id" });
  // };
  // return User;