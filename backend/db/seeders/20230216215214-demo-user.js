'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Maria',
        lastName: 'Davis',
        email: 'MariaMDavis@rhyta.com',
        username: 'DemoUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Frederick',
        lastName: 'Peasley',
        email: 'FrederickFPeasley@armyspy.com',
        username: 'DemoUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Dora',
        lastName: 'McCabe',
        email: 'DoraSMcCabe@rhyta.com',
        username: 'DemoUser3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Oscar',
        lastName: 'Cornish',
        email: 'OscarOCornish@teleworm.us',
        username: 'DemoUser4',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Violet',
        lastName: 'Stone',
        email: 'VioletIStone@armyspy.com',
        username: 'DemoUser5',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Eve',
        lastName: 'Marble',
        email: 'EveSMarble@rhyta.com',
        username: 'DemoUser6',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Elizabeth',
        lastName: 'Deen',
        email: 'ElizabethDDeen@dayrep.com',
        username: 'DemoUser7',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        firstName: 'Stephen',
        lastName: 'Conley',
        email: 'StephenLConley@rhyta.com',
        username: 'DemoUser8',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        firstName: 'Ricky',
        lastName: 'Teel',
        email: 'RickyLTeel@jourrapide.com',
        username: 'DemoUser9',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demoUser@demo.com',
        username: 'DemoUser',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
