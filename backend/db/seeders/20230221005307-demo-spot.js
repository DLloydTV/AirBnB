'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1205 Locust Court',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 33.95087,
        lng: -118.201548,
        name: 'Home Away From Home! KingBed, & Spacious Backyard',
        description: "This newly renovated home is ideal for any family or group of friends coming to Los Angeles for any sports event or concert, as we are centrally located!",
        price: 228,
      },
      {
        ownerId: 1,
        address: '1719 Gordon Street',
        city: 'Pomona',
        state: 'CA',
        country: 'USA',
        lat: 34.130588,
        lng: -117.833121,
        name: 'Newly Remodeled Philips Ranch vacation home w Pool',
        description: "Beautifully remodeled & decorated vacation home. Featuring outdoor pool and spacious outdoor dining area. Multiple lounging areas with 4 bedrooms, 3 full bathrooms and functional working spaces. Peaceful neighborhood, surrounded by local shops and restaurants. Only 12 miles from Ontario International Airport and convention center. 21 miles from Disneyland. 9 miles from Chino Hills state park with lots of hiking trails. 2000sqft of living space provides plenty of space for the whole family.",
        price: 237,
      },
      {
        ownerId: 2,
        address: '423 Golf Course Drive',
        city: 'Washington',
        state: 'DC',
        country: 'USA',
        lat: 39.126742,
        lng: -76.93465,
        name: 'Location, Location, Location - US Capitol & more',
        description: "Enjoy our sunny basement apartment a few blocks from the Capitol. Our renovated English basement is spacious, bright and clean. It has a private entrance, queen bed, large couch, kitchen, washer, dryer, TV... It is ideal for a couple but can accommodate a third, ideally a child.",
        price: 108,
      },
      {
        ownerId: 2,
        address: '2491 MiddleBrook Lane',
        city: 'Washington',
        state: 'DC',
        country: 'USA',
        lat: 37.275588,
        lng: -124.337121,
        name: 'Spacious H Street Corridor English Basement',
        description: "Just steps from bustling H Street, with numerous restaurants, bars, and a Whole Foods supermarket, you can enjoy a stylish experience with easy access to food, culture, and the community of our neighborhood. Our lower level apartment has ample room for a comfortable, modern stay, with many amenities.",
        price: 115,
      },
      {
        ownerId: 3,
        address: '4893 Love Deer Drive',
        city: 'Daytona Beach',
        state: 'FL',
        country: 'USA',
        lat: 26.533332,
        lng: -80.058462,
        name: 'Hear the Ocean waves in Adorable Beachside Condo',
        description: "Arrive and unwind at this Stunning Oceanfront condo. Please note because of the Hurricane Ian and Nicole all pools indoor and outdoor including hot tubs are closed until spring. Located only 2 miles from downtown Daytona Beach boardwalk and shops. Other nearby destinations include: Daytona International Speedway and 1 hour from Disney World. The space is cleaned by trusted professionals after every guest.",
        price: 133,
      },
      {
        ownerId: 2,
        address: '4206 Everette Alley',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 25.910329,
        lng: -80.293987,
        name: 'Luxury Miami Brickell 1Br/1Ba AKA Condo POOL',
        description: "A king bedroom with stunning Miami skyline views, fully equipped kitchen and spacious living room with sofa bed.",
        price: 138,
      },
      {
        ownerId: 3,
        address: '3514 Duck Creek Road',
        city: 'San Jose',
        state: 'CA',
        country: 'USA',
        lat: 37.504709,
        lng: -121.982637,
        name: 'Lovely entire house in SJFree, parking, laundry/Wi-Fi',
        description: "Updated 2 bedrooms, 2 bathrooms house. Free driveway parking and on street, safe & quiet. A beautiful kitchen, an island with sink, dishwasher, microwave, gas cooking range, big refrigerator, AC, Heather, washer/dryer. Free wifi 400Mbps, TV cable 125+ channels.",
        price: 142,
      },
      {
        ownerId: 5,
        address: '1794 Airplane Avenue',
        city: 'Stamford',
        state: 'CT',
        country: 'USA',
        lat: 41.004491,
        lng: -73.516094,
        name: 'DOWNTOWN STAMFORD - WELCOME TO NEW ENGLAND',
        description: "Nice small 1 bedrooms apartment loft style, well decorated, walking distance from downtown Stamford.",
        price: 95,
      },
      {
        ownerId: 1,
        address: '3054 White River Way',
        city: 'Salt Lake City',
        state: 'UT',
        country: 'USA',
        lat: 40.734346,
        lng: -111.821891,
        name: 'NEW! Spacious Murray Home Near Ski Resorts!',
        description: "Book this spacious Murray home and find yourself amongst the area's best ski resorts! Whether you're traveling in the winter hoping to hit the slopes or in the summer in search of great outdoor recreation, this vacation rental is the perfect place for you. This property is fitted with 4 bedrooms, 2 full bathrooms, a half bath, and a large fenced yard, giving you and your family ample room to relax. Plus, with plenty of dining and shopping in the area, you'll always be entertained!",
        price: 133,
      },
      {
        ownerId: 3,
        address: '1495 Camel Back Road',
        city: 'Boley',
        state: 'OK',
        country: 'USA',
        lat: 35.606976,
        lng: -96.429085,
        name: 'Welcome to Sycamore Hill a quiet relaxing retreat',
        description: "Book this spacious Murray home and find yourself amongst the area's best ski resorts! Whether you're traveling in the winter hoping to hit the slopes or in the summer in search of great outdoor recreation, this vacation rental is the perfect place for you. This property is fitted with 4 bedrooms, 2 full bathrooms, a half bath, and a large fenced yard, giving you and your family ample room to relax. Plus, with plenty of dining and shopping in the area, you'll always be entertained!",
        price: 150,
      },
      {
        ownerId: 4,
        address: '2070 Hart Country Lane',
        city: 'Atlanta',
        state: 'GA',
        country: 'USA',
        lat: 33.793724,
        lng: -84.412549,
        name: 'Atlanta Great Location',
        description: "Get ready to Make yourself at home in our Beautiful newly renovated ranch style home in highly sought after Gresham Park area. Our place features 3 bedrooms with 2 full baths a Dream Kitchen with all new stainless steel appliances, tiled backsplash, Quartz counter tops, an amazing open floor plan, as well as a 10 ft deck.",
        price: 105,
      },
      {
        ownerId: 1,
        address: '378 Virginia Street',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        lat: 41.659206,
        lng: -87.518363,
        name: '52nd Floor MagMile Penthouse Views Fireplace Pool',
        description: "This Penthouse unit is a magnificent unique rental in Chicago. Towering above the city, with floor to ceiling window in with a the spacious open floor plan living areas and exquisite fireplace, this Penthouse gives you the ultimate in city living. It's all about the views and location. The city unfolds before 52 floors above a Lake Michigan backdrop; nowhere in Chicago can you stay with views like theses special place is close to everything, making it easy to plan your visit.",
        price: 177,
      },
      ])
      },

  async down (queryInterface, Sequelize) {
     options.tableName = 'Spots';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options, {
       username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
     }, {});
  }
};
