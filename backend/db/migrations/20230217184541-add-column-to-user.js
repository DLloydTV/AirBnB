'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Users"
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(options, 'firstName', {
        type: Sequelize.STRING(25),
      }),
      queryInterface.addColumn(options, 'lastName', {
        type: Sequelize.STRING(25),
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users"
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn(options, 'firstName'),
      queryInterface.removeColumn(options, 'lastName')
    ]);
  }
};
