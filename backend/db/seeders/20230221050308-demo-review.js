'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Reviews'
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: "Amazing stay amazing host!",
        stars: 5
      },
      {
        spotId: 1,
        userId: 6,
        review: "Great Airbnb place, we stayed here because we attended a concert at the forum. The place was nice and it was amazing to have the convertible pool table.",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: "The place was perfect, everything described and then some.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 9,
        review: "Host was very responsive and kept a very clean place.",
        stars: 3,
      },
      {
        spotId: 3,
        userId: 8,
        review: "Absolutely the best place to stay in you are working on The Hill!",
        stars: 5,
      },
      {
        spotId: 4,
        userId: 6,
        review: "Really great place. Very spacious, clean, and has everything you would need. Neighborhood is great as well. Would definitely stay here again.",
        stars: 5,
      },
      {
        spotId: 5,
        userId: 7,
        review: "Great spot on the beach. Nice room with a good view.",
        stars: 3,
      },
      {
        spotId: 5,
        userId: 9,
        review: "Great place to stay!! The view of the ocean was nice despite the pool",
        stars: 4,
      },
      {
        spotId: 5,
        userId: 8,
        review: "Great location right on the beach!",
        stars: 3,
      },
      {
        spotId: 6,
        userId: 7,
        review: "Just was very responsive to the problems that I had and was very gracious.",
        stars: 4,
      },
      {
        spotId: 7,
        userId: 9,
        review: "Clean, well appointed home! Designer kitchen, bathrooms and outdoor patio entertainment area.",
        stars: 5,
      },
      {
        spotId: 7,
        userId: 8,
        review: "Wow! This home was amazing ,and the pictures didn't do it justice.",
        stars: 5,
      },
      {
        spotId: 8,
        userId: 6,
        review: "The location was amazing, within walking distance of food, drinks and center of town.",
        stars: 4,
      },
      {
        spotId: 9,
        userId: 9,
        review: "My whole family enjoyed our stay here!",
        stars: 4,
      },
      {
        spotId: 10,
        userId: 6,
        review: "Beautiful setting and just the place we needed on our road trip. Amazing sunrise while having coffee.",
        stars: 4,
      },
      {
        spotId: 11,
        userId: 9,
        review: "The property looks just like the pictures. The home is nice in a very quiet neighborhood.",
        stars: 4,
      },
      {
        spotId: 12,
        userId: 8,
        review: "The location was excellent, and the view was even better! The door staff were both helpful and pleasant. The building amenities and the apartment itself were first class.",
        stars: 5,
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
    })
  }
};
