'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'resetToken', Sequelize.STRING);
    await queryInterface.addColumn('Users', 'resetExpiredAt', Sequelize.DATE);
  },

  down: async (queryInterface, Sequelize) => {
  }
};
