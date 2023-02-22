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
  
  module.exports = {
    handleValidationErrors,
    validateSpot
  };