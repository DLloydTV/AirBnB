const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');

// Delete a Spot Image
router.delete('/:imageId'), requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const user = req.user;

    const image = await SpotImage.findByPk(imageId);
    const spot = await image.getSpot();

    const err = {};

    if (!image) {
        err.title = "Couldn't find a Spot Image with the specified id";
        err.status = 404;
        err.message = "Spot Image couldn't be found";
        return next(err)
    };


    if (user.id !== spot.ownerId) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Cannot delete image from spot not owned by user";
        return next(err);
    };

    image.destroy();

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
};





module.exports = router