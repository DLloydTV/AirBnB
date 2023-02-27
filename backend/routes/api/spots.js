const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op, json } = require('sequelize');
const { validateSpot, handleValidationErrors, validateSpotImage, validateReview, validateBooking, validateQuery } = require('../../utils/validation');

const { checkIfSpotExists, checkIfUsersSpot } = require('../../utils/error-handlers')

// const { checkIfSpotExists } = require('../../utils/error-handlers.js')
// const checkIfSpotExists = require("../../utils/error-handlers.js")

// Validation Imports
// const { validateSpot } = require('../../utils/validation');

// GET All Spots
router.get('/', validateQuery, async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let spotsArr = [];


    page = Number(page);
    size = Number(size);

    if (!page) page = 1;
    if (!size) size = 20;
    if (page > 10) page = 10;
    if (size > 10) size = 20;

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    // Query to add Reviews and Spot Images to Spot object
    const query = {
        where: {},
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            }
        ],
        ...pagination
    }

    // Min & Max Latitude Query
    if (maxLat && !minLat) {
        query.where.lat = {
            [Op.lte]: maxLat
        }
    };

    if (!maxLat && minLat) {
        query.where.lat = {
            [Op.gte]: minLat
        }
    };

    if (maxLat && minLat) {
        query.where.lat = {
            [Op.and]: {
                [Op.lte]: maxLat,
                [Op.gte]: minLat
            }
        }
    };


    // Min & Max Longitude Query
    if (maxLng && !minLng) {
        query.where.lng = {
            [Op.lte]: maxLng
        }
    };

    if (!maxLng && minLng) {
        query.where.lng = {
            [Op.gte]: minLng
        }
    };

    if (maxLng && minLng) {
        query.where.lng = {
            [Op.and]: {
                [Op.lte]: maxLng,
                [Op.gte]: minLng
            }
        }
    };


    // Min & Max Price Query
    if (maxPrice && !minPrice) {
        query.where.price = {
            [Op.lte]: maxPrice
        }
    };

    if (!maxPrice && minPrice) {
        query.where.price = {
            [Op.gte]: minPrice
        }
    };

    if (maxPrice && minPrice) {
        query.where.price = {
            [Op.and]: {
                [Op.lte]: maxPrice,
                [Op.gte]: minPrice
            }
        }
    };

    let spots = await Spot.findAll(query)

    // Adding Avg Review Score and preview Image to Spot
    spots.forEach(spot => {
        let eachSpot = spot.toJSON();

        let count = spot.Reviews.length;
        let sum = 0;
        spot.Reviews.forEach((review) => sum += review.stars)
        let avg = sum / count;
        if (!avg) {
            avg = "No current ratings"
        };

        eachSpot.avgRating = avg;

        if (eachSpot.SpotImages.length > 0) {
            for (let i = 0; i < eachSpot.SpotImages.length; i++) {
                if (eachSpot.SpotImages[i].preview === true) {
                    eachSpot.previewImage = eachSpot.SpotImages[i].url;
                }
            }
        }

        // If No Preview Image, Spot Review, or Spot Images Exists
        if (!eachSpot.previewImage) {
            eachSpot.previewImage = "No preview image available";
        }

        if (!eachSpot.Reviews.length > 0) {
            eachSpot.Reviews = "This Spot has no reviews"
        }

        if (!eachSpot.SpotImages.length > 0) {
            eachSpot.SpotImages = "This Spot has no images"
        }

        delete eachSpot.Reviews;
        delete eachSpot.SpotImages;
        spotsArr.push(eachSpot);
    })
    
   return res.json(spotsArr)
});

// Get all Spots owned by Current User
router.get('/current', requireAuth, async (req, res, next) => {
    let user = req.user;

    let spots = await user.getSpots({
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            }
        ]
    })

    let spotsOwned = [];

    spots.forEach(spot => {
        let eachSpot = spot.toJSON();

        let count = spot.Reviews.length;
        let sum = 0;
        spot.Reviews.forEach((review) => sum += review.stars)
        let avg = sum / count;
        if (!avg) {
            avg = "No current ratings"
        };

        eachSpot.avgRating = avg;

        if (eachSpot.SpotImages.length > 0) {
            for (let i = 0; i < eachSpot.SpotImages.length; i++) {
                if (eachSpot.SpotImages[i].preview === true) {
                    eachSpot.previewImage = eachSpot.SpotImages[i].url;
                }
            }
        }

        if (!eachSpot.previewImage) {
            eachSpot.previewImage = "No preview image available";
        }

        if (!eachSpot.Reviews.length > 0) {
            eachSpot.Reviews = "No current reviews"
        }

        if (!eachSpot.SpotImages.length > 0) {
            eachSpot.SpotImages = "No current SpotImages"
        }

        delete eachSpot.SpotImages;
        delete eachSpot.Reviews;
        spotsOwned.push(eachSpot);
    })


    if (spotsOwned.length === 0) {
        res.json("Sorry, you don't own any spots")
    }

   return res.json({
        Spots: spotsOwned
    })
});

// GET Spot By Id
router.get('/:spotId', checkIfSpotExists, async (req, res, next) => {
    let { spotId } = req.params;
    let spot = await Spot.findByPk(spotId)

    spot = spot.toJSON()

    // Add Review Count
    let count = await Review.count({
        where: {
            spotId: spotId
        }
    });

    spot.numReviews = count

    // Add AVG Review Rating
    let sum = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    });

    if (count >= 1) {
        spot.avgStarRating = sum / count
    } else {
        spot.avgStarRating = "No current ratings"
    };

    // Add Spot Images
    let spotImages = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    });

    if (spotImages.length >= 1) {
        spot.SpotImages = spotImages
    } else {
        spot.SpotImages = "No images available"
    };

    return res.json(spot)
});

// Testing User
// router.get('/current', async (req, res, next) => {
//     let user = req.users

//     console.log(user)

//     res.json(user)
// })


// CREATE A Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    
    let user = req.user;

    let newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.status(201).json(newSpot)
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, checkIfSpotExists, checkIfUsersSpot, validateSpotImage, async (req, res, next) => {
    let { spotId } = req.params;
    let { url, preview } = req.body;

    const user = req.user;

    const spot = await Spot.findByPk(spotId);

    let spotImage = await spot.createSpotImage({
        url: url,
        preview: preview
    });

    return res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });
});

// Edit a Spot
router.put('/:spotId', requireAuth, checkIfSpotExists, checkIfUsersSpot, validateSpot, async (req, res, next) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    return res.json(spot);
});

// Delete a Spot
router.delete('/:spotId', requireAuth, checkIfSpotExists, checkIfUsersSpot, async (req, res, next) => {
    const { spotId } = req.params;

    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    spot.destroy();
    
    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });
});

// Get all Reviews by Spot's id
router.get('/:spotId/reviews', checkIfSpotExists, async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    const reviews = await spot.getReviews({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    let reviewsArr = [];
    reviews.forEach(review => {
        let eachReview = review.toJSON();

        if (!eachReview.ReviewImages.length > 0) {
            eachReview.ReviewImages = "No review images available"
        }

        reviewsArr.push(eachReview);
    })

    if(!reviewsArr.length) {
        return res.json("No reviews for this spot")
    };

    return res.json({
        Reviews: reviewsArr
    });
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, checkIfSpotExists, validateReview, async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars} = req.body;

    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    let existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    });

    if (existingReview) {
        const err = {};
        err.title = "Review from user already exists for this spot";
        err.status = 403;
        err.message = "You already left a review for this spot";
        return next(err)
    };

    const newReview = await spot.createReview({
        userId: user.id,
        review: review,
        stars: stars
    });

    return res.status(201).json(newReview)

})

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, checkIfSpotExists, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;

    const spot = await Spot.findByPk(spotId);

    let bookings = await spot.getBookings({
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    });

    if (!bookings.length > 0) {
        return res.json({
            message: "No bookings for current spot"
        })
    }

    const bookingsArr = [];
    bookings.forEach(booking => {
        booking = booking.toJSON();
        if (user.id !== spot.ownerId) {
            let eachBooking = {
                spotId: booking.spotId,
                startDate: booking.startDate,
                endDate: booking.endDate
            };
            bookingsArr.push(eachBooking);
        } else {
            let eachBooking = {
                User: booking.User,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
            bookingsArr.push(eachBooking);
        }
    })

    return res.json({
        Bookings: bookingsArr
    })
    
});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, checkIfSpotExists, validateBooking, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;
    let { startDate, endDate } = req.body;

    startDate = new Date(startDate);
    endDate = new Date(endDate)


    const spot = await Spot.findByPk(spotId);

    const err = {}

    console.log(startDate)

    if (startDate <= new Date()) {
        err.title = "Can't make a booking in the past";
        err.statusCode = 403;
        err.message = "Start date cannot be before today";
        return next(err)
    }

    if (endDate <= startDate) {
        err.title = "Validation error";
        err.statusCode = 400;
        err.message = "End date cannot be on or before start Date";
        return next(err);
    };


    /// Owner can't make booking on own spot
    if (user.id === spot.ownerId) {
        err.title = "Owner can't make booking for owned spot";
        err.status = 403;
        err.message = "Current user owns this spot";
        return next(err);
    };

    const bookings = await spot.getBookings();

    bookings.forEach(booking => {
        booking = booking.toJSON();
        err.title = "Booking Conflict";
        err.status = 403;
        err.message = "Sorry, this spot is already booked for the specified dates";

        bookedStartDate = new Date(booking.startDate);
        bookedEndDate = new Date(booking.endDate);

        if ((bookedStartDate <= startDate) && bookedEndDate >= startDate) {
            err.errors = [
                { startDate: "Start date conflicts with an existing booking" }
            ]
            return next(err);
        } else if (((bookedStartDate <= endDate) && (endDate <= bookedEndDate))) {
            err.errors = [
                { endDate: "End date conflicts with an existing booking" }
            ]
            return next(err);
        } else if ((bookedStartDate >= startDate) && (bookedEndDate <= endDate)) {
            err.errors = [
                { startDate: "Start date conflicts with an existing booking" },
                { endDate: "End date conflicts with an existing booking" }
            ]
            return next(err);
        }
    });

    if (!err.errors) {
        let newBooking = await spot.createBooking({
            userId: user.id,
            startDate: startDate,
            endDate: endDate
        })
        return res.json(newBooking)
    };
})


module.exports = router;