'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'SpotImage';
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-766992447820961125/original/011eefd3-26e4-4c41-a237-f41ef4a2341d.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-744564385202996622/original/8380103c-1a83-4cc9-aa6d-6822bdb74ea6.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/8c6c6be0-09e6-4163-985a-88dc4ea3b2b3.jpg?im_w=960",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-728023437924039960/original/f9759d50-348b-473b-bc59-f0a414fd4fee.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/a39e9e8b-4bb6-43ca-adde-8fd5bbe47706.jpg?im_w=960",
        preview: true
      },
      {
        spotId: 6,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-52282926/original/e045d2b7-a7af-4e4d-b7b9-8b1f98244074.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 7,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-695117947451944598/original/150f0011-3d1a-41e5-830a-5449d736b559.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/ccb87215-71e3-4b47-8400-a12d88d2907b.jpg?im_w=960",
        preview: true
      },
      {
        spotId: 9,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-829010178728456870/original/4942bf7a-ed1a-4668-a1db-a8d9dad52405.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-606337567931532849/original/8ae047f8-094a-40ed-b3a5-feb91c344cc0.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-785803074838439157/original/ce128fc0-5063-43c2-ab3b-e48d08b45d45.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-556419741274302000/original/86cce449-4ec3-4988-bdbc-d7d0b083917d.jpeg?im_w=960",
        preview: true
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }), {}
  }
};