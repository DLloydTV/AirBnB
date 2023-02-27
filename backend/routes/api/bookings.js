const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op, json } = require('sequelize');
const { validateSpot, handleValidationErrors, validateSpotImage, validateReview, validateReviewImage, validateBooking } = require('../../utils/validation');

const { checkIfSpotExists, checkIfUsersSpot, checkIfReviewExists, checkIfUsersReview, checkIfBookingExists } = require('../../utils/error-handlers');

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
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
            message: "No bookings for current user"
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

// Edit a Booking
router.put('/:bookingId', requireAuth, checkIfBookingExists, validateBooking, async (req, res, next) => {
    const { bookingId } = req.params;
    const user = req.user;
    let { startDate, endDate } = req.body;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let editedBooking = await Booking.findByPk(bookingId);

    let err= {};
    if (startDate <= new Date()) {
        err.title =  "Can't start a booking in the past";
        err.status = 403;
        err.message = "Start date cannot be before today";
        return next(err);
    }

    bookingStartDate = new Date(editedBooking.startDate);
    bookingEndDate = new Date(editedBooking.endDate);

    const spotId = editedBooking.spotId;

    if (bookingEndDate < new Date()) {
        err.title = "Can't edit a booking that's past the end date";
        err.status = 403;
        err.message = "Past bookings can't be modified";
        return next(err);
    };

    if (endDate <= startDate) {
        err.title = "Validation error";
        err.statusCode = 400;
        err.message = "endDate cannot be on or before startDate";
        return next(err);
    };

    if (user.id !== editedBooking.userId) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Booking doesn't belong to current user";
        return next(err);
    }

    const spot = await Spot.findByPk(spotId);
    const bookings = await spot.getBookings();

    bookings.forEach(booking => {
        if (booking.id !== editedBooking.id) {
            booking = booking.toJSON();
            err.title = "Booking Conflict";
            err.status = 403;
            err.message = "Sorry, this spot is already booked for the specified dates";

            bookedStartDate = new Date(booking.startDate);
            bookedEndDate = new Date(booking.endDate);


            if ((bookedStartDate <= startDate) && (bookedEndDate >= startDate)) {
                err.errors = [
                    {
                        endDate: "End date conflicts with an existing booking"
                    }
                ]
                return next(err);
            } else if ((bookedStartDate <= endDate) && (bookedEndDate >= endDate)) {
                err.errors = [
                    {
                        endDate: "End date conflicts with an existing booking"
                    }
                ]
                return next(err);
            } else if ((bookedStartDate >= startDate) && (bookedEndDate <= endDate)) {
                err.errors = [
                    {
                        startDate: "Start date conflicts with an existing booking"
                    },
                    {
                        endDate: "End date conflicts with an existing booking"
                    }
                ]
                return next(err)
            }
        }
    });

    if (!err.errors) {
        editedBooking.startDate = startDate;
        editedBooking.endDate = endDate;

        editedBooking.save();

        return res.json(editedBooking);
    }
});

// Delete a Booking
router.delete('/:bookingId', requireAuth, checkIfBookingExists, async (req, res, next) => {
    const { bookingId }= req.params;
    const user = req.user;

    let booking = await Booking.findByPk(bookingId);

    let spot = await booking.getSpot();

    let err = {};

    if ((user.id !== booking.userId) && (user.id !== spot.ownerId)) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Booking doesn't belong to current user";
        return next(err);
    }

    const startDate = new Date(booking.startDate);

    if (startDate <= new Date()) {
        err.title = "Bookings that have been started or completed can't be deleted";
        err.status = 403;
        err.message = "Bookings that have been started or completed can't be deleted";
        return next(err)
    };

    booking.destroy();
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
});

module.exports = router