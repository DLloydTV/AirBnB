const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op, json } = require('sequelize');
const { validateSpot, handleValidationErrors, validateSpotImage, validateReview, validateReviewImage } = require('../../utils/validation');

const { checkIfSpotExists, checkIfUsersSpot, checkIfReviewExists, checkIfUsersReview } = require('../../utils/error-handlers');

// Get all of the Current User's Bookings
router.get('/:current', requireAuth, async (req, res, next) => {
    const user = req.user;

    const bookings = await user.getBookings({
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name'],
            include: [{
                model: SpotImage,
                attributes: ['url']
            }]
        }]
    });

    if (!bookings.length > 0) {
        return res.json({
            message: "No bookings for current spot"
        })
    };

    const bookingsArr = [];
    bookings.forEach(booking => {
        booking = booking.toJSON();
        if (booking.Spot.SpotImages.length > 0) {
            for (let i = 0; i < booking.Spot.SpotImages.length; i++) {
                if (booking.Spot.SpotImages[i].preview === true) {
                    booking.Spot.previewImage = booking.Spot.SpotImages[i].url;
                }
            }
        };

        if (!booking.Spot.previewImage) {
            booking.Spot.previewImage = "No preview image available";
        };

        delete booking.Spot.SpotImages;
        const eachBooking = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: booking.Spot,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }
        bookingsArr.push(eachBooking);
    })

    return res.json({
        Bookings: bookingsArr
    })
    
});

module.exports = router