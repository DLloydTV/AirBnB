const sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

// Check If Spot Exists
const ifSpotExists = async (req, res, next) => {
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




module.exports = ifSpotExists;