const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op } = require('sequelize');
const { validateSpot, handleValidationErrors } = require('../../utils/validation');

const { ifSpotExists, ifUsersSpot, convertDate } = require('../../utils/error-handlers')

// const { ifSpotExists } = require('../../utils/error-handlers.js')
// const ifSpotExists = require("../../utils/error-handlers.js")

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
})

// GET Spot By Id
router.get('/:spotId', ifSpotExists, async (req, res, next) => {
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

    let ownedSpots = [];

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
        ownedSpots.push(eachSpot);
    })


    if (ownedSpots.length === 0) {
        res.json("Sorry, you don't own any spots")
    }

   return res.json({
        Spots: ownedSpots
    })
})
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

})


module.exports = router;