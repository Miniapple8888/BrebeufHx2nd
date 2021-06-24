'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('User_Language', 'type', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('User_Language', 'proficiency', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('User_Language', 'type', { transaction: t }),
        queryInterface.removeColumn('User_Language', 'proficiency', { transaction: t })
      ]);
    });
  }
};
