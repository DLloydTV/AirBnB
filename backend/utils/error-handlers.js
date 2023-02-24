const sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../db/models');

// Check If Spot Exists
const checkIfSpotExists = async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        let err = {};
        err.title = 'Not found';
        err.response = "Couldn't find a Spot with the specified id";
        err.status = 404;
        err.message = "Spot couldn't be found";
        
        return next(err);
    }
    return next();
};

// Check If Spot Belongs To User
const checkIfUsersSpot = async (req, res, next) => {
    let { spotId } = req.params;
    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    if (user.id !== spot.ownerId) {
        const err = {};
        err.title = "Authorization error";
        err.status = 403;
        err.message = "spot doesn't belong to current user";
        return next(err);
    }
    return next()
};

// Check If Review Belongs To User
const checkIfUsersReview = async (req, res, next) => {
    let { reviewId } = req.params;
    const user = req.user;
    const review = await Review.findByPk(reviewId);

    if (review.userId !== user.id) {
        const err = {};
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Review doesn't belong to current user";
        return next(err);
    }
    return next()
};

// Check if Review exists
const checkIfReviewExists = async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.user;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        const err = {};
        err.title = "Couldn't find a Review with the specified id";
        err.message = "Review couldn't be found";
        err.status = 404;
        return next(err);
    }
    return next()
}




module.exports = {
    checkIfSpotExists,
    checkIfUsersSpot,
    checkIfUsersReview,
    checkIfReviewExists
}