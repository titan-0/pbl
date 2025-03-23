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
    body('shop.shop_address').isLength({ min: 3 }).withMessage('Shop address must be at least 3 characters'),
    body('shop.gstNumber').matches(/^[0-9A-Z]{15}$/).withMessage('GST Number must be exactly 15 characters'),
    body('shop.licenseNumber').isNumeric().withMessage('License number must be a number'),
    body('shop.services').isArray().withMessage('Services must be an array'),
    body('shop.location.coordinates').isArray().withMessage('Coordinates must be an array'),
    body('shop.location.coordinates.*').isNumeric().withMessage('Coordinates must be numbers')
], captaincontroller.registercaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be of length 6 or greater than 6'),
], captaincontroller.logincaptain);

router.get('/profile', authmiddleware.authcaptain, captaincontroller.getcaptainprofile);

router.get('/logout', authmiddleware.authcaptain, captaincontroller.logoutcaptain);

module.exports = router;
