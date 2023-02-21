const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');

const sequelize = require('sequelize');
const { Op } = require('sequelize');
const { validateSpot } = require('../../utils/validation');

// GET All Spots
router.get('/', async (req, res) => {
    let spots = await Spot.findAll()

    res.json(spots)
})

// GET Spot By Id
router.get('/:id', async (req, res) => {

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