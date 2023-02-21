const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op } = require('sequelize');

// Get All Spots
router.get('/', async (req, res) => {
    let spots = await Spot.findAll()

    res.json(spots)
})

// GET Spot By Id
router.get('/:id')


module.exports = router;