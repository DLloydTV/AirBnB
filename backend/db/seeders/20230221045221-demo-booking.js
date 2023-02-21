'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Bookings'
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 6,
        startDate: new Date("2023-01-07"),
        endDate: new Date("2023-01-11")
      },
      {
        spotId: 2,
        userId: 7,
        startDate: new Date("2023-01-28"),
        endDate: new Date("2023-02-03")
      },
      {
        spotId: 3,
        userId: 8,
        startDate: new Date("2023-02-12"),
        endDate: new Date("2023-02-15")
      },
      {
        spotId: 4,
        userId: 9,
        startDate: new Date("2023-02-17"),
        endDate: new Date("2023-02-20")
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    })
  }
};