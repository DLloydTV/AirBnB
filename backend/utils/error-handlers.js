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
}




module.exports = {
    checkIfSpotExists,
    checkIfUsersSpot
}