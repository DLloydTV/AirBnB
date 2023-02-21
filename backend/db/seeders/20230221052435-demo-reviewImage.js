'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'ReviewImages'
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-766992447820961125/original/69cdf56f-d1ee-4d14-9509-c9e40699d5c5.jpeg?im_w=720'
      },
      {
        reviewId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-744564385202996622/original/39dda966-686f-431f-b050-864e1961f24d.jpeg?im_w=1200'
      },
      {
        reviewId: 5,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-12253009/original/d2f55f89-e2c7-4464-8fbf-f3e46f365e75.jpeg?im_w=720'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
