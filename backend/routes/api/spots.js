const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op, json } = require('sequelize');
const { validateSpot, handleValidationErrors, validateSpotImage, validateReview } = require('../../utils/validation');

const { checkIfSpotExists, checkIfUsersSpot } = require('../../utils/error-handlers')

// const { checkIfSpotExists } = require('../../utils/error-handlers.js')
// const checkIfSpotExists = require("../../utils/error-handlers.js")

// Validation Imports
// const { validateSpot } = require('../../utils/validation');

// GET All Spots
router.get('/', async (req, res) => {
    let spotsArr = [];
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
    }

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

    console.log(user)
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


module.exports = router;