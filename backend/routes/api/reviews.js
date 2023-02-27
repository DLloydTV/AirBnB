const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op, json } = require('sequelize');
const { validateSpot, handleValidationErrors, validateSpotImage, validateReview, validateReviewImage } = require('../../utils/validation');

const { checkIfSpotExists, checkIfUsersSpot, checkIfReviewExists, checkIfUsersReview } = require('../../utils/error-handlers');

// Get all Review of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user;
    const userId = user.id;

    const reviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [{
                    model: SpotImage,
                    attributes: ['url', 'preview']
                }]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    if (!reviews) {
        return res.json("No reviews for current user")
    }

    let reviewArr = [];
    reviews.forEach(review => {
        let eachReview = review.toJSON();
        if (eachReview.Spot.SpotImages.length > 0) {
            for (let i = 0; i < eachReview.Spot.SpotImages.length; i++) {
                if (eachReview.Spot.SpotImages[i].preview === true) {
                    eachReview.Spot.previewImage = eachReview.Spot.SpotImages[i].url;
                }
            }
        }

        if (!eachReview.Spot.previewImage) {
            eachReview.Spot.previewImage = "No preview image available";
        }

        if (!eachReview.ReviewImages.length > 0) {
            eachReview.ReviewImages = "No current review images available"
        }

        delete eachReview.Spot.SpotImages
        reviewArr.push(eachReview);
    })

    return res.json({
        Reviews: reviewArr
    });
});


// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, checkIfReviewExists, checkIfUsersReview, validateReviewImage, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user

    const review = await Review.findByPk(reviewId)

    let allReviewImages = await review.getReviewImages()

    const err = {}
    if (allReviewImages.length >= 10) {
        err.title = "Cannot add any more images because there is a maximum of 10 images per resource";
        err.message = "Maximum number of images for this resource was reached";
        err.status = 403;
        return next(err)
    };

    const newReviewImage = await review.createReviewImage({
        url: url
    });

    res.json({
        id: newReviewImage.id,
        url: newReviewImage.url
    })
});

// Edit a Review
router.put('/:reviewId', requireAuth, checkIfReviewExists, checkIfUsersReview, validateReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.user;
    const { review, stars } = req.body;

    let editedReview = await Review.findByPk(reviewId);

    editedReview.review = review;
    editedReview.stars = stars;

    await editedReview.save();

    return res.json(editedReview);
});

// Delete a review
router.delete('/:reviewId', requireAuth, checkIfReviewExists, checkIfUsersReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.user;

    let review = await Review.findByPk(reviewId);

    review.destroy();

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;