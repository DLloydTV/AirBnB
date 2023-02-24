const { check } = require('express-validator')
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) { 
      const errors = {};
      validationErrors
        .array()
        .forEach(error => errors[error.param] = error.msg);
  
      const err = Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err);
    }
    next();
  };

  // Validate Signup
  const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsey: true })
        .withMessage('Must provide a firstName'),
    check('lastName')
        .exists({ checkFalsey: true })
        .withMessage('Must provide a lastName'),
    handleValidationErrors
];

  // Validate Spot
  const validateSpot = [
    check('address')
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .notEmpty()
      .withMessage('City is required'),
    check('state')
      .notEmpty()
      .withMessage('State is required'),
    check('country')
      .notEmpty()
      .withMessage('Country is required'),
    check('lat', "Latitude is not valid")
      .notEmpty()
      .bail()
      .isDecimal()
      .withMessage('Latitude is not valid'),
    check('lng', "Longitude is not valid")
      .notEmpty()
      .bail()
      .isDecimal()
      .withMessage('Longitude is not valid'),
    check('name')
      .notEmpty()
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .notEmpty()
      .withMessage('Description is required'),
    check('price')
      .notEmpty()
      .withMessage('Price per day is required'),
    handleValidationErrors
];

// Validate Spot Image
const validateSpotImage = [
  check('url')
    .notEmpty()
    .withMessage('url must be valid'),
    check('preview')
    .notEmpty()
    .isBoolean()
    .withMessage('preview must be a boolean'),
    handleValidationErrors
];

// Validate Review
const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

// Validate Review Image
const validateReviewImage = [
  check('url')
    .notEmpty()
    .withMessage('url is not valid'),
  handleValidationErrors
]
  
  module.exports = {
    handleValidationErrors,
    validateSpot,
    validateSpotImage,
    validateReview,
    validateReviewImage
  };