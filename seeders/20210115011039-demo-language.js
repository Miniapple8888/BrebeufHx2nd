'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Languages', [
     {
       language: 'English',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
      language: 'French',
      createdAt: new Date(),
      updatedAt: new Date()
     },
     {
      language: 'Spanish',
      createdAt: new Date(),
      updatedAt: new Date()
     }
   ], {});
   await queryInterface.bulkInsert('Interests', [
    {
      name: 'Basketball',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Cooking',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Singing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
