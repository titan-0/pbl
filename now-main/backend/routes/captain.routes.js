const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const captaincontroller = require('../controlers/captain.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.post('/register', [
    body('shopname').isLength({ min: 3 }).withMessage('Shop name must be at least 3 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be of length 6 or greater than 6'),
    body('phoneNumber').isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits'),
    body('shop.shop_address').isLength({ min: 5 }).withMessage('Shop address must be at least 5 characters long'),
    body('shop.gstNumber').isLength({ min: 15, max: 15 }).withMessage('GST Number must be exactly 15 characters'),
    body('shop.licenseNumber').isLength({ min: 5 }).withMessage('License number must be at least 5 characters long'),
    body('shop.services').isArray({ min: 1 }).withMessage('At least one service must be provided'),
    body('shop.location.lat').isNumeric().withMessage('Latitude must be a number'),
    body('shop.location.lng').isNumeric().withMessage('Longitude must be a number'),
], captaincontroller.registercaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be of length 6 or greater than 6'),
], captaincontroller.logincaptain);

router.get('/profile', authmiddleware.authcaptain, captaincontroller.getcaptainprofile);

router.get('/logout', authmiddleware.authcaptain, captaincontroller.logoutcaptain);

module.exports = router;
