'use strict';
const {
  Model, STRING
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      isAlpha: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your first name.'
        },
        len: [2, 20]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      isAlpha: true,
      notNull: true,
      validate: {
        len: [2, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true,
      notNull: true,
      unique: true
    },
    // TODO: Validate password before entering
    passwordHash: {
      type: DataTypes.STRING,
      notNull: true,
      //is: /^[0-9a-f]{64}$/i
    },
    emailVerificationExpirationDate: {
      type: DataTypes.DATE
    },
    emailVerified: {
      type: DataTypes.BOOLEAN
    },
    lastLoggedIn: {
      type: DataTypes.DATE
    },
    loggedIn: {
      type: DataTypes.BOOLEAN
    },
    resetToken: {
      type: DataTypes.STRING
    },
    resetExpiredAt: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};