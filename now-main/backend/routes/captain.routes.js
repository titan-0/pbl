const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const captaincontroller = require('../controlers/captain.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('shopname').isLength({ min: 3 }).withMessage('Shop name must be at least 3 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phoneNumber').matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('shop.gstNumber').matches(/^[0-9A-Z]{15}$/).withMessage('GST Number must be exactly 15 characters'),
    body('shop.licenseNumber').isNumeric().withMessage('License number must be a number'),
    body('shop.services').isArray().withMessage('Services must be an array'),
    body('shop.shop_address').isLength().withMessage('give valid address'),
    body('shop.location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('Coordinates must be an array of two numbers [longitude, latitude]')
        .custom((coordinates) => {
            if (coordinates.length !== 2) {
                throw new Error('Coordinates must contain exactly two values');
            }
            const [longitude, latitude] = coordinates;
            if (typeof longitude !== 'number' || typeof latitude !== 'number') {
                throw new Error('Coordinates must be numbers');
            }
            return true;
        }),
], captaincontroller.registercaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be of length 6 or greater than 6'),
], captaincontroller.logincaptain);

router.get('/profile', authmiddleware.authcaptain, captaincontroller.getcaptainprofile);

router.get('/logout', authmiddleware.authcaptain, captaincontroller.logoutcaptain);

module.exports = router;
